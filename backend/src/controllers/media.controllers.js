import { asyncHandler } from "../utils/asyncHandler.js";
import imageKitService from "../services/imageKit.service.js";
import ApiResponse from "../utils/api-response.js";
import { getSearchQueryByFileIds } from "../utils/helpers.js";
import ApiError from "../utils/api-error.js";

const getAuthParams = asyncHandler(async (req, res) => {
    const { token, expire, signature } = await imageKitService.getParams();

    res.json(
        new ApiResponse(
            200,
            { token, expire, signature },
            "Params generated successully",
        ),
    );
});

const getFiles = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { fileIds, path } = req.body;

    const searchQuery = getSearchQueryByFileIds(_id, fileIds);
    const list = await imageKitService.getList(searchQuery, path);

    res.json(new ApiResponse(200, list, "Files fetched successfully"));
});

const deleteFiles = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { fileIds, path } = req.body;

    const searchQuery = getSearchQueryByFileIds(_id, fileIds);
    const list = await imageKitService.getList(searchQuery, path);

    const filteredFileIds = list.map((el) => el.fileId);

    if (filteredFileIds.length === 0)
        throw new ApiError(400, "Invalid file IDs or path");

    imageKitService.deleteImages(filteredFileIds);

    res.json(new ApiResponse(200, {}, "Files deleted successfully"));
});

export {
    getAuthParams,
    deleteFiles,
    getFiles,
};
