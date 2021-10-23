import {RequestHandler} from "express";
import {plainToClass} from "class-transformer"
import {validate, ValidationError} from "class-validator";
import BadRequestError from "../errors/bad-request-error";
import {Types} from "mongoose";

export class Validator {

    public static object <T>(type: any, skipMissingProperties = false): RequestHandler {
        return (req, res, next) => {
            validate(plainToClass(type, req.body), { skipMissingProperties })
                .then((errors: ValidationError[]) => {
                    if (errors.length > 0) {
                        const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
                        next(new BadRequestError(message));
                    } else {
                        next();
                    }
                });
        };
    }

    public static param(name: string, id?: boolean): RequestHandler {
        return (req, res, next) => {
            const param = req.params[name]
            if(param) {
                if(id === true && !Types.ObjectId.isValid(param)) {
                    next(new BadRequestError('Invalid object ID'))
                } else {
                    next()
                }
            } else {
                next(new BadRequestError('Missing request parameter'))
            }
        };
    }

    public static query(name: string): RequestHandler {
        return (req, res, next) => {
            const query = req.query[name]
            if(query) {
                next()
            } else {
                next(new BadRequestError('Missing request query'))
            }
        };
    }
}





