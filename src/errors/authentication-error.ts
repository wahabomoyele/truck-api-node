import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-error'

class AuthenticationError extends CustomAPIError {
    statusCode = StatusCodes.UNAUTHORIZED;
    constructor(message: string) {
        super(message);
    }
}

export default AuthenticationError;
