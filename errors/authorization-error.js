const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-error');
class AuthorizationError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = AuthorizationError;
