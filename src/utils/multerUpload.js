const Multer = require("multer");
const { ALLOWED_FILETYPES } = require("./constants");
const storage = Multer.memoryStorage();
const ApiError = require("./api-error");

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

module.exports = multer;

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

// module.exports = upload;
