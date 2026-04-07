import crypto from "node:crypto";
import { TOKEN_LENGTH, PAGINATION_LIMIT } from "shared/constants.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import ApiError from "./api-error.js";
import PDFDocument from "pdfkit";
import {
    generateTableRow,
    generateHeader,
    generateCustomerInformation,
} from "./invoiceHelpers.js";

const createHash = (body, secret) => {
    return crypto.createHmac("sha256", secret).update(body).digest("hex");
};

export const getAccessToken = (cookie) => {
    if(!cookie) return;

    let accessToken;

    cookie.split("; ")?.forEach((el) => {
        if (el.startsWith("accessToken")) accessToken = el.split("=")[1];
    });

    return accessToken;
};

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

const getVendorPayoutFilterationPipeline = (filterQueries) => {
    const pipeline = [];

    let { paid, notPaid, minPrice, maxPrice } = filterQueries;

    minPrice = +minPrice;
    maxPrice = +maxPrice;

    if (minPrice || maxPrice) {
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
            },
        });
    }

    if (paid !== undefined && notPaid !== undefined && !(paid && notPaid)) {
        pipeline.push({
            $match: {
                ...(paid && { isPaid: true }),
                ...(notPaid && { isPaid: false }),
            },
        });
    }

    return pipeline;
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
                ...(stockAvailability && { stockQuantity: { $gt: 0 } }),
                ...(+ratings && { avgRating: { $gte: +ratings } }),
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
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews",
                // pipeline: [
                //     {
                //         $lookup: {
                //             from: "user",
                //             localField: "reviews.user",
                //             foreignField: "_id",
                //             as: "reviews.user",
                //         },
                //     },
                //     {
                //         $addFields: {
                //             user: {
                //                 $arrayElemAt: ["$reviews.user", 0],
                //             },
                //         },
                //     },
                // ],
            },
        },
        {
            $addFields: {
                avgRating: {
                    $avg: "$reviews.ratings",
                },
            },
        },
        // {
        //     $unset: ["reviews"],
        // },
    ];
};

const getSearchQueryByFileIds = (userId, fileIds) => {
    let str = fileIds.map((el) => `"${el}"`).join();

    str = `"customMetadata.user"="${userId}" AND "id" in [${str}]`;

    return str;
};


const validateSchema = (validationSchema, payload) => {
    const validation = validationSchema.safeParse(payload);

    console.log(validation.error);
    if (!validation.success) throw new ApiError();

    return validation.data;
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const body = orderId + "|" + paymentId;

    const expectedSignature = createHash(body, process.env.RAZORPAY_KEY_SECRET);

    return expectedSignature === signature;
};

const createInvoice = ({baseOrder, sellerOrders}) => {
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
        generateCustomerInformation(doc, baseOrder);

        let currentY = 280;

        generateTableRow(
            doc,
            currentY,
            "Item",
            "Store Name",
            "Unit Cost",
            "Quantity",
            "Total",
            true
        );

        currentY += 30;

        doc.font("Helvetica");

        sellerOrders.forEach((el) => {
            el.products.forEach(({ product, quantity }) => {
                if (currentY > 750) {
                    doc.addPage();
                    currentY = 50;
                    generateTableRow(
                        doc,
                        currentY,
                        "Item",
                        "Store Name",
                        "Unit Cost",
                        "Quantity",
                        "Total",
                        true
                    );
                    currentY += 30;
                }

                generateTableRow(
                    doc,
                    currentY,
                    product.name,
                    el.vendor.storeName,
                    "Rs. " + product.price,
                    quantity,
                    "Rs. " + product.price * quantity,
                    false
                );
                currentY += 25;
            });
        });

        currentY += 10;
        doc.fontSize(12).font("Helvetica-Bold");
        generateTableRow(
            doc,
            currentY,
            "",
            "",
            "Total Amount",
            "",
            "Rs. " + baseOrder.amount,
            true
        );

        doc.end();
    });
};

export {
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
    getProductBasePipeline,
    createHash,
    getVendorPayoutFilterationPipeline,
};
