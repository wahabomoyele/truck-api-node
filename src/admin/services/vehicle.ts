import {VehicleBrandModel, VehicleModel } from '../../models/vehicle/Vehicle'
import {UserModel} from "../../models/user/User";
import NotFoundError from "../../errors/not-found-error";
import {VehicleBrandDocument, VehicleDocument} from "../../models/vehicle/VehicleDto";


export class VehicleService {

    addVehicle = async (vehicle: VehicleDocument) => {

        let brand = vehicle.brand

        // Its allowed to use brand id
        if(typeof brand === 'string') {
            brand = await VehicleBrandModel.findById(vehicle.brand)
        }

        vehicle.brand = brand

        // Check if user id is valid and fetch vehicle owner for update
        const owner = await UserModel.findById(vehicle.owner)


        const newVehicle = await VehicleModel.create(vehicle)

        if(owner) {
            const roleSet = new Set(owner.roles)
            if(!roleSet.has('OWNER')) {
                roleSet.add('OWNER')
                owner.roles = Array.from(roleSet)
                UserModel.findOneAndUpdate({_id: vehicle.owner}, owner)
            }
        }
        return newVehicle
    }

    getVehicle = async (id: string) => {
        return await VehicleModel.findById(id).exec()
    }

    getVehicles = async () => {
        return await VehicleModel.find({}).exec()
    }

    updateVehicle = async (id: string, update: any): Promise<VehicleDocument> => {
        const vehicle = await VehicleModel.findById(id)
        if(vehicle) {
            Object.assign(vehicle, update)
            vehicle.save()
            return vehicle
        }
        throw new NotFoundError('Vehicle not found with ID: ' + id)
    }

    deleteVehicle = async (id: string): Promise<VehicleDocument> => {
        const vehicle = await VehicleModel.findById(id)
        if(vehicle) {
            return vehicle.remove()
        }
        throw new NotFoundError('Vehicle not found with ID: ' + id)
    }

    getVehicleBrands = async () => {
        return await VehicleBrandModel.find({})
    }

    addVehicleBrand = async (brand: VehicleBrandDocument) => {
        return await VehicleBrandModel.create(brand)
    }

    deleteVehicleBrand = async (id: string) => {
        return await VehicleBrandModel.findByIdAndRemove(id)
    }

}

