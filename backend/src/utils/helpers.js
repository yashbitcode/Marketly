import crypto from "node:crypto";
import { TOKEN_LENGTH, PAGINATION_LIMIT } from "../../../shared/constants.js";
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

        invoice.sellerOrders.forEach((el) => {
            el.products.forEach(({ product, quantity }) => {
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
