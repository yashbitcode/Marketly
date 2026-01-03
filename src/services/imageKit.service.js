const ImageKit = require("@imagekit/nodejs");

class ImageKitService {
    constructor() {
        this.client = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });
    }

    async getParams() {
        const params = this.client.helper.getAuthenticationParameters();

        return params;
    }

    async deleteImage(fileId) {
        const result = await this.client.files.delete(fileId);

        return result;
    }

    async deleteImages(fileIds) {
        const result = await this.client.files.bulk.delete({
            fileIds
        });

        return result;
    }

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

module.exports = new ImageKitService();
