const mongoose = require('mongoose')


const BrandSchema = mongoose.Schema({
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


const VehicleSchema = mongoose.Schema({
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
        type: {_id: String, name: String, logoUrl: String},
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
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
        type: Array,
    },
    createdBy: {
        type: String,
        required: true
    }
}, {timestamps: true})

VehicleSchema.pre('save', async function() {
    if(this.regNumber) {
        this.regNumber = this.regNumber.toUpperCase()
    }
})

VehicleSchema.post('remove', async function() {
    // console.log('removing...')
    const vehicles = await this.model('Vehicle').find({owner: this.owner})
    if(vehicles.length > 0) {
        const user = await this.model('User').findOne({email: this.owner})
        const roleSet = new Set(user.roles)
        roleSet.delete('OWNER')
        user.roles = [...roleSet]
        await user.save()
    }

})

BrandSchema.pre('save', async function() {
    this.name = this.name.toUpperCase().trim()
})

BrandSchema.pre('remove', async function() {
    const vehicles = await this.model('Vehicle').find({brand: {_id: this._id}})
    if (vehicles.length > 0) {
        throw new Error('Vehicle brand is in use')
    }
})

const Vehicle = mongoose.model('Vehicle', VehicleSchema)
const VehicleBrand = mongoose.model('VehicleBrand', BrandSchema)



module.exports = {Vehicle, VehicleBrand}
