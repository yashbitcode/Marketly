class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        
        if(stack) this.stack = stack;
        else this.stack = Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;