import {Schema, model, Model} from 'mongoose'
import * as bcrypt from 'bcryptjs'
import {VehicleModel} from '../vehicle/Vehicle'
import BadRequestError from "../../errors/bad-request-error";
import {UserDocument} from "./UserDto";
import {AddressSchema} from "../address/Address";
import config from "config";

interface UserModel extends Model<UserDocument> {
}


const UserSchema = new Schema<UserDocument>({
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

const removeVehicles = async function(userId: string) {
    try {
        await VehicleModel.deleteMany({owner: userId})
    } catch (e) {
        console.log(e)
    }
}

// Salt strength used on the authentication server is 10
UserSchema.pre('save', async function (next) {
    let user = this as UserDocument;

    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(config.get('saltStrength'))
        const hash = await bcrypt.hash(user.password.trim(), salt)
    }

    if(user.isDirectModified("name")) {
        this.name = this.name.toUpperCase().trim()
    }

    if(user.isModified("email")) {
        this.email = this.email.toLowerCase().trim()
    }

    return next()

})

UserSchema.post('remove', async function() {
    await removeVehicles(this._id)
})

UserSchema.methods.comparePassword = async function (suppliedPassword) {
    if(this.password) return await bcrypt.compare(suppliedPassword.trim(), this.password); else
        throw new BadRequestError('Password not set for user')
}
export const UserModel = model<UserDocument, UserModel>('User', UserSchema)
