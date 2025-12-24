const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Something went wrong";

    res.status(statusCode).json({
        success: err.success,
        message,
        errors: err.errors
    });
};

module.exports = {
    handleError
};