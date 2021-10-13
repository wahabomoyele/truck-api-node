const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Vehicle = require('./Vehicle')

const AddressSchema = mongoose.Schema({
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    postalCode: {
        type: String
    },
    contact: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Address contact is required']
    }
})

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    phoneNumber: {
        type: String,
        minlength: [8, 'Phone number too short']
    },
    roles: {
        type: [String],
        default: ['CUSTOMER'],
        enum: {
            values: ['ADMIN', 'OWNER', 'DRIVER', 'CUSTOMER', 'PARTNER'],
            message: '{VALUE} is not a supported user type'
        }
    },
    address: {
        type: AddressSchema
    },
    password: {
        type: String,
    },
    isActive:{
        type: Boolean,
        default: false
    }
})

UserSchema.statics.removeVehicles = async function(userId) {
    try {
        await Vehicle.deleteMany({owner: userId})
    } catch (e) {
        console.log(e)
    }
}

// Salt strength used on the authentication server is 10
UserSchema.pre('save', async function () {
    if(this.password) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password.trim(), salt)
    }
    this.name = this.name.toUpperCase().trim()
    this.email = this.email.toLowerCase().trim()
})

UserSchema.post('remove', async function() {
    await this.constructor.removeVehicles(this._id)
})

UserSchema.methods.comparePassword = async function (suppliedPassword) {
    return await bcrypt.compare(suppliedPassword.trim(), this.password);
}

module.exports = mongoose.model('User', UserSchema)
