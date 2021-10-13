const {authorizationError, authenticationError} = require('../errors')
const jwt = require('jsonwebtoken');

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SIGNING_KEY);

const authenticateUser = async (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        throw new authenticationError('Authentication invalid');
    }
    const token = tokenHeader.split(' ')[1]

    try {
        // Payload from the auth server
        const payload = verifyToken(token);
        req.user = payload
        if(req.body && req.method === 'POST') req.body.createdBy = payload.email
        next();
    } catch (error) {
        throw new authenticationError('Authentication invalid');
    }
};


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.every(role => req.user.authorities.includes(role))) {
            throw new authorizationError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};

module.exports = {authenticateUser, authorizeRoles}
