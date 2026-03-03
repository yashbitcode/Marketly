import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

class ImageKitService {
    constructor() {
        this.client = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });
    }

    async getParams(totalCounts) {
        try {
            const params = [];

            while (totalCounts--) {
                const { token, expire, signature } =
                    this.client.helper.getAuthenticationParameters();

                params.push({
                    token,
                    expire,
                    signature,
                    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                });
            }

            return params;
        } catch (err) {
            console.log(err);
        }
    }

    async getList(filterQuery, path) {
        const result = await this.client.assets.list({
            searchQuery: filterQuery,
            path,
        });

        return result;
    }

    async deleteImages(fileIds) {
        const result = await this.client.files.bulk.delete({
            fileIds,
        });

        return result;
    }

    async upload(buffer) {
        return await this.client.files.upload({
            file: await toFile(buffer),
            fileName: "invoice",
            folder: "/order-invoices",
        });
    }

    //  async deleteImage(fileId) {
    //     const result = await this.client.files.delete(fileId);

    //     return result;
    // }

    // async uploadFile(file) {
    //     const info = await this.imageKit.upload(
    //         {
    //             file: file.buffer.toString("base64"),
    //             fileName: file.originalname,
    //             folder: "product-images",
    //             useUniqueFileName: true,
    //         }
    //     );

    //     return info;
    // }

    // async getUrl() {
    //     return this.imageKit.url({
    //         src: "https://ik.imagekit.io/wh8pevb66h/product-images/ec2.png",
    //         transformation: [
    //             {
    //                 height: "300",
    //                 width: "400",
    //                 raw: "l-text,i-Imagekit,fs-50,l-end",
    //             },
    //         ],
    //         transformationPosition: "query",
    //     });
    // }
}

export default new ImageKitService();
