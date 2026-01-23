const crypto = require("node:crypto");
const { TOKEN_LENGTH, PAGINATION_LIMIT } = require("./constants");
const slugify = require("slugify");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const ApiError = require("./api-error");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const {
    generateTableRow,
    generateHeader,
    generateCustomerInformation,
    generateHr,
} = require("./invoiceHelpers");

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

    // pipeline.push(
    //     ...[
    //         {
    //             $lookup: {
    //                 from: "sub-categories",
    //                 localField: "category",
    //                 foreignField: "_id",
    //                 as: "category",
    //                 pipeline: [
    //                     {
    //                         $lookup: {
    //                             from: "parent-categories",
    //                             localField: "parentCategory",
    //                             foreignField: "_id",
    //                             as: "parentCategory",
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "vendors",
    //                 localField: "vendor",
    //                 foreignField: "_id",
    //                 as: "vendor",
    //             },
    //         },
    //         {
    //             $unwind: "$category",
    //         },
    //         {
    //             $unwind: "$category.parentCategory",
    //         },
    //         {
    //             $unwind: "$vendor",
    //         },
    //     ],
    // );

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

const getPaginationBasePipeline = (page) => {
    return [
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $facet: {
                data: [
                    { $skip: PAGINATION_LIMIT * (page - 1) },
                    { $limit: PAGINATION_LIMIT },
                ],
                totalCount: [{ $count: "count" }],
            },
        },
        {
            $project: {
                data: 1,
                totalCount: {
                    $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                },
            },
        },
    ];
};

const getProductBasePipeline = () => {
    return [
        {
            $lookup: {
                from: "vendors",
                localField: "vendor",
                foreignField: "_id",
                as: "vendor",
            },
        },
        {
            $addFields: {
                vendor: { $arrayElemAt: ["$vendor", 0] },
            },
        },
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
                    {
                        $addFields: {
                            parentCategory: {
                                $arrayElemAt: ["$parentCategory", 0],
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                category: { $arrayElemAt: ["$category", 0] },
            },
        },
    ];
};

const getSearchQueryByFileIds = (userId, fileIds) => {
    let str = fileIds.map((el) => `"${el}"`).join();

    str = `"customMetadata.user_id"="${userId}" AND "id" in [${str}]`;

    return str;
};

const validateSchema = (validationSchema, payload) => {
    const validation = validationSchema.safeParse(payload);

    console.log(validation.error);
    if (!validation.success) throw new ApiError();

    return validation.data;
};

const verifyRazorpaySignature = (orderId, paymenId, signature) => {
    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === signature;
};

const createInvoice = (invoice) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const chunks = [];

        let topMargin = 500;

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

        generateHeader(doc);
        generateCustomerInformation(doc, invoice);

        doc.fontSize(12);

        generateTableRow(
            doc,
            topMargin,
            "Item",
            "Store Name",
            "Unit Cost",
            "Quantity",
            "Total",
        );

        let counter = 0;

        doc.font("Helvetica");

        invoice.sellerOrders.forEach((el, idx) => {
            el.products.forEach(({ product, quantity }, idx) => {
                if (topMargin + counter++ * 10 > 650) {
                    topMargin = 50;
                    counter = 0;

                    doc.addPage();
                }

                generateTableRow(
                    doc,
                    topMargin + counter++ * 10,
                    product.name,
                    el.vendor.storeName,
                    "Rs. " + product.price,
                    quantity,
                    "Rs. " + product.price * quantity,
                );
            });
        });

        doc.fontSize(14);
        generateTableRow(
            doc,
            topMargin + counter++ * 10,
            "",
            "",
            "Total Amount",
            "",
            "Rs. " + invoice.order.amount,
        );

        doc.end();
    });
};

module.exports = {
    generateRandomNumberString,
    generateSlug,
    generateUniqueSlug,
    generateBaseTokens,
    getProductFilterationPipeline,
    getSearchQueryByFileIds,
    validateSchema,
    verifyRazorpaySignature,
    createInvoice,
    getPaginationBasePipeline,
    getProductBasePipeline
};
