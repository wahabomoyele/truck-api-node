import {Schema, model, Model, Types, Document} from 'mongoose';
import {VehicleBrandDocument, VehicleDocument, VehiclePopulatedDocument} from "./VehicleDto";
import {UserModel} from "../user/User";



const BrandSchema = new Schema<VehicleBrandDocument>({
    name: {
        type: String,
        minlength: [3, 'Vehicle brand name is too short'],
        required: [true, 'Vehicle brand name is required'],
        unique: true
    },
    logoUrl: {
        type: String,
    }
})


const VehicleSchema = new Schema<VehicleDocument>({
    regNumber: {
        type: String,
        minlength: [7, 'Registration number is too short'],
        unique: true,
        required: [true, 'Vehicle registration number is required']
    },
    type: {
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: {
            values: ['TRUCK', 'BUS', 'CAR'],
            message: '{VALUE} is not a supported vehicle type (use: TRUCK, BUS, CAR)'
        }
    },
    brand: {
        type: Types.ObjectId,
        required: true
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageReviews: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    health: {
        type: Number,
        min: 1,
        max: 5,
    },
    active: {
        type: Boolean,
        default: true
    },
    images: {
        type: [String],
    },
    createdBy: {
        type: String,
        required: true
    }
}, {timestamps: true})

VehicleSchema.pre('save', async function(this: VehicleDocument) {
    if(this.regNumber) {
        this.regNumber = this.regNumber.toUpperCase()
    }
})

VehicleSchema.post('remove', async function(this: VehicleDocument) {
    // console.log('removing...')
    const vehicles = await model('Vehicle').find({owner: this.owner})
    if(vehicles.length > 0) {
        const user = await UserModel.findOne({email: this.owner})
        if(user) {
            const roleSet = new Set(user.roles)
            roleSet.delete('OWNER')
            user.roles = Array.from(roleSet)
            await user.save()
        }
    }

})

VehicleSchema.statics.findOwnerAndBrand = async function(this: Model<VehicleDocument>, id: string) {
    return await this.findById(id).populate('owner').populate('brand').exec()
}

BrandSchema.pre('save', async function() {
    this.name = this.name.toUpperCase().trim()
})

BrandSchema.pre('remove', async function() {
    const vehicles = await model('Vehicle').find({brand: {_id: this._id}})
    if (vehicles.length > 0) {
        throw new Error('Vehicle brand is in use')
    }
})

interface VehicleModel extends Model<VehicleDocument>{
    findOwnerAndBrand: Promise<VehiclePopulatedDocument>
}

export const VehicleModel = model<VehicleDocument, VehicleModel>('Vehicle', VehicleSchema)
export const VehicleBrandModel = model<VehicleBrandDocument>('VehicleBrand', BrandSchema)

