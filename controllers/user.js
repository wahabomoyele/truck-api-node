const userService = require('../services/user')
const {StatusCodes} = require('http-status-codes')
const {badRequestError} = require('../errors')

const addUser = async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(StatusCodes.CREATED).json(user)
}

const getUser = async (req, res) => {
    const user = await userService.getUser(req.params.id)
    res.status(StatusCodes.OK).json(user)
}

const getUsers = async (req, res) => {
    const users = await userService.getUsers()
    res.status(StatusCodes.OK).json(users)
}

const updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body)
    res.status(StatusCodes.OK).json(user)
}

const deleteUser = async (req, res) => {
    await userService.deleteUser(req.params.id)
    res.status(StatusCodes.OK).json({message: `User with id ${req.params.id} deleted`})
}


// Authentication requests
const getUserForAuth = async (req, res) => {
    const {email} = req.query
    if(email) {
        const user = await userService.getUserForAuth(email)
        res.status(StatusCodes.OK).json(user)
    } else {
        throw new badRequestError('Email missing from request')
    }
}

module.exports = {addUser, getUsers, getUser, updateUser, deleteUser, getUserForAuth}
