import AuthenticationError from "../errors/authentication-error";
import AuthorizationError from "../errors/authorization-error";
import {Request, Response, NextFunction} from "express";

const jwt = require('jsonwebtoken');


const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SIGNING_KEY);

export const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Authentication invalid');
    }
    const token = tokenHeader.split(' ')[1]

    try {
        // Payload from the auth server
        const payload = verifyToken(token);
        // @ts-ignore
        req.user = payload
        if(req.body && req.method === 'POST') req.body.createdBy = payload.email
        next();
    } catch (error) {
        throw new AuthenticationError('Authentication invalid');
    }
};


export const AuthorizationMiddleware = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        if (!roles.every(role => req.user.authorities.includes(role))) {
            throw new AuthorizationError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};


