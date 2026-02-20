import Multer from "multer";
import { ALLOWED_FILETYPES } from "./constants.js";
const storage = Multer.memoryStorage();
import ApiError from "./api-error.js";

const filterFileConfig = function (req, file, cb) {
    const isValid = ALLOWED_FILETYPES.includes(file.mimetype);

    if (isValid) cb(null, true);
    else
        cb(
            new ApiError(
                400,
                "Invalid filetype: Supported filetypes are (jpeg, jpg, png)",
            ),
            false,
        );
};

const multer = Multer({ storage, fileFilter: filterFileConfig });

export default multer;

// const storageConfig = multer.diskStorage({
//     destination: path.join(__dirname, "uploads"),
//     filename: (req, file, res) => {
//         console.log(file);
//         res(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({
//     storage: storageConfig,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: filterFileConfig
// });

// export default upload;
