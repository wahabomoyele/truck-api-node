const vehicleService = require('../services/vehicle')
const {StatusCodes} = require('http-status-codes')

const addVehicle = async (req, res) => {
    const vehicle = await vehicleService.addVehicle(req.body)
    res.status(StatusCodes.CREATED).json(vehicle)
}

const getVehicle = async (req, res) => {
    const vehicle = await vehicleService.getVehicle(req.params.id)
    res.status(StatusCodes.OK).json(vehicle)
}

const getVehicles = async (req, res) => {
    const vehicles = await vehicleService.getVehicles()
    res.status(StatusCodes.OK).json(vehicles)
}

const updateVehicle = async (req, res) => {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body)
    res.status(StatusCodes.OK).json(vehicle)
}

const deleteVehicle = async (req, res) => {
    await vehicleService.deleteVehicle(req.params.id)
    res.status(StatusCodes.OK).json({message: `Vehicle with id ${req.params.id} deleted`})
}

const addVehicleBrand = async (req, res) => {
    const brand = await vehicleService.addVehicleBrand(req.body)
    res.status(StatusCodes.CREATED).json(brand)
}

const getVehicleBrands = async (req, res) => {
    const brands = await vehicleService.getVehicleBrands()
    res.status(StatusCodes.OK).json(brands)
}

const deleteVehicleBrand = async (req, res) => {
    await vehicleService.deleteVehicleBrand(req.params.id)
    res.status(StatusCodes.OK).json({message: `Vehicle brand with id ${req.params.id} deleted`})
}


module.exports = {
    addVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    addVehicleBrand,
    getVehicleBrands,
    deleteVehicleBrand
}
