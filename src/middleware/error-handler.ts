import { StatusCodes } from 'http-status-codes';
import {Request, Response, NextFunction, ErrorRequestHandler} from "express";

const errorHandlerMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong try again later',
    };
    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',');
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for '${Object.keys(
            err.keyValue
        )}' field(s), enter unique value(s)`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        if(err.kind === 'ObjectId') {
            customError.message = `No item found with id : ${err.value}`;
            customError.statusCode = 404;
        }

        if(err.kind === 'Embedded') {
            customError.message = `Invalid request body path: ${err.path} => ${err.value}`;
            customError.statusCode = 400;
        }
    }

    return res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;
