const {Vehicle, VehicleBrand} = require('../models/Vehicle')
const User = require('../models/User')
const {notFoundError} = require('../errors')


const addVehicle = async (vehicle) => {

    let brand = vehicle.brand

    // Its allowed to use brand id
    if(typeof brand === 'string') {
        brand = await VehicleBrand.findById(vehicle.brand)
    }

    vehicle.brand = brand

    // Check if user id is valid and fetch vehicle owner for update
    const owner = await User.findById(vehicle.owner)


    const newVehicle = await Vehicle.create(vehicle)

    const roleSet = new Set(owner.roles)
    if(!roleSet.has('OWNER')) {
        roleSet.add('OWNER')
        owner.roles = [...roleSet]
        User.findOneAndUpdate({_id: vehicle.owner}, owner).exec()
    }
    return newVehicle
}

const getVehicle = async (id) => {
    return await Vehicle.findOne({_id: id})
}

const getVehicles = async () => {
    return await Vehicle.find({}).exec()
}

const updateVehicle = async (id, update) => {
    const vehicle = await Vehicle.findById(id)
    if(vehicle) {
        Object.assign(vehicle, update)
        return await vehicle.save()
    }
    throw new notFoundError('Vehicle not found with ID: ' + id)
}

const deleteVehicle = async (id) => {
    const vehicle = await Vehicle.findById(id)
    if(vehicle) {
        return await vehicle.remove()
    }
    throw new notFoundError('Vehicle not found with ID: ' + id)
}

const getVehicleBrands = async () => {
    return await VehicleBrand.find({})
}

const addVehicleBrand = async (brand) => {
    return await VehicleBrand.create(brand)
}

const deleteVehicleBrand = async (id) => {
    return await VehicleBrand.findByIdAndRemove(id)
}

module.exports = {
    addVehicle,
    getVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
    addVehicleBrand,
    deleteVehicleBrand,
    getVehicleBrands
}
