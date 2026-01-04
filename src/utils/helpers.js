const crypto = require("node:crypto");
const { TOKEN_LENGTH } = require("./constants");
const slugify = require("slugify");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");

const generateRandomNumberString = () => {
    let result = "";
    const chars = "0123456789";

    const randomArray = new Uint8Array(TOKEN_LENGTH);
    crypto.getRandomValues(randomArray);

    randomArray.forEach((num) => {
        result += chars[num % chars.length];
    });

    return result;
};

const generateSlug = (title) => {
    if (!title) return "";

    return slugify(title, {
        lower: true,
        strict: false,
    });
};

const generateUniqueSlug = (title) => {
    if (!title) return "";

    return (
        slugify(title, {
            lower: true,
            strict: false,
        }) +
        "-" +
        nanoid(6)
    );
};

const generateBaseTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return {
        accessToken,
        refreshToken,
    };
};

const getProductFilterationPipeline = (filterQueries) => {
    const pipeline = [];
    let {
        minPrice,
        maxPrice,
        categories,
        subCategories,
        brandName,
        ratings,
        stockAvailability,
    } = filterQueries;

    minPrice = +minPrice;
    maxPrice = +maxPrice;
    categories = categories?.split(",");
    subCategories = subCategories?.split(",");

    pipeline.push(
        ...[
            {
                $lookup: {
                    from: "sub-categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $lookup: {
                                from: "parent-categories",
                                localField: "parentCategory",
                                foreignField: "_id",
                                as: "parentCategory",
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $unwind: "$category.parentCategory",
            },
            {
                $unwind: "$vendor",
            },
        ],
    );

    if (brandName)
        pipeline.push({
            $match: {
                $expr: {
                    $eq: [
                        {
                            $toLower: "$brandName",
                        },
                        brandName.toLowerCase(),
                    ],
                },
            },
        });

    if (minPrice || maxPrice || stockAvailability || ratings)
        pipeline.push({
            $match: {
                ...((minPrice ||
                    minPrice === 0 ||
                    maxPrice ||
                    maxPrice === 0) && {
                    price: {
                        ...((minPrice || minPrice === 0) && {
                            $gte: minPrice,
                        }),
                        ...((maxPrice || maxPrice === 0) && {
                            $lte: maxPrice,
                        }),
                    },
                }),
                ...(stockAvailability && { stockAvailability: { $gt: 0 } }),
                ...(ratings && { ratings: { $gte: ratings } }),
            },
        });

    if (true)
        pipeline.push({
            $match: {
                $expr: {
                    $and: [
                        (categories && {
                            $in: ["$category.parentCategory.slug", categories],
                        }) ||
                            true,
                        (subCategories && {
                            $in: ["$category.slug", subCategories],
                        }) ||
                            true,
                    ],
                },
            },
        });

    return pipeline;
};

const getSearchQueryByFileIds = (userId, fileIds) => {
    let str = fileIds.map(el => `"${el}"`).join(); 
    
    str = `"customMetadata.user_id"="${userId}" AND "id" in [${str}]`;

    return str;
}

module.exports = {
    generateRandomNumberString,
    generateSlug,
    generateUniqueSlug,
    generateBaseTokens,
    getProductFilterationPipeline,
    getSearchQueryByFileIds
};
