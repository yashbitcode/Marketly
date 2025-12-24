const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Something went wrong";
    const success = err.success ?? false;
    const errors = err.errors ?? {};

    res.status(statusCode).json({
        statusCode,
        success,
        message,
        errors,
    });
};

module.exports = {
    handleError
};