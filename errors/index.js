const customError = require('./custom-error')
const notFoundError = require('./not-found-error')
const badRequestError = require('./bad-request-error')
const authenticationError = require('./authentication-error')
const authorizationError = require('./authorization-error')

module.exports = {
    customError,
    notFoundError,
    badRequestError,
    authenticationError,
    authorizationError
}
