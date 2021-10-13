const User = require('../models/User')
const {badRequestError} = require('../errors')

const createUser = async (user) => {

    // The 'unique' option is not a validator so
    // duplicate check fails when the index has not been built
    const emailAlreadyExists = await User.findOne({ email: user.email });
    if (emailAlreadyExists) {
        throw new badRequestError('Email already exists');
    }


    // All new users start out as a 'CUSTOMER'.
    // Registering a vehicle adds the 'OWNER' role to a user
    // Admins can assign 'PARTNER' roles
    user.roles = ['CUSTOMER']


    let {_id, name, email, phoneNumber, roles} = await User.create(user)
    return {_id, name, email, phoneNumber, roles}
}

const getUsers = async () => {
    return await User.find({}).select('-password')
}

const getUser = async (id) => {
    return await User.findById(id).select('-password')
}

const updateUser = async (id, update) => {
    const user = await User.findById(id)
    delete update.password
    delete update.email
    if(user) {
        Object.assign(user, update)
        return await user.save()
    }
}

const deleteUser = async (id) => {
    return await User.findByIdAndRemove(id)
}

const getUserForAuth = async (email) => {
    const user = await User.findOne({email})
    if(!user) throw new badRequestError('')

    // Authentication server is using Spring security. Roles must have 'ROLE_' prefix
    const r = []
    user.roles.forEach(role => {
        r.push('ROLE_' + role)
    })
    user.roles = r
    user.isActive = 1
    console.log(user)
    return user
}

module.exports = {createUser, getUser, updateUser, deleteUser, getUsers, getUserForAuth}
