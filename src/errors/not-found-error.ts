import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-error';

class NotFoundError extends CustomAPIError{
    statusCode = StatusCodes.NOT_FOUND
    constructor(message: string) {
        super(message);
    }
}

export default NotFoundError
