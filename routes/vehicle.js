const express = require('express')
const {addVehicle, getVehicle, getVehicles, deleteVehicle, updateVehicle, getVehicleBrands, addVehicleBrand, deleteVehicleBrand} = require('../controllers/vehicle')
const router = express.Router()

router.route('/').get(getVehicles).post(addVehicle)
router.route('/brand').get(getVehicleBrands).post(addVehicleBrand)
router.route('/brand/:id').delete(deleteVehicleBrand)
router.route('/:id').get(getVehicle).patch(updateVehicle).delete(deleteVehicle)




module.exports = router
