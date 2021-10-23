import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-error';
class AuthorizationError extends CustomAPIError {
    statusCode = StatusCodes.FORBIDDEN
    constructor(message: string) {
        super(message);
    }
}

export default AuthorizationError;
