import Controller from "./Controller";
import {Router} from "express";
import {AuthenticationMiddleware, AuthorizationMiddleware} from "../../middleware/auth";
import {Validator} from "../../middleware/validator";
import {VehicleService} from "../services/vehicle";
import {VehicleDto} from "../../models/vehicle/VehicleDto";

export class VehicleController implements Controller{
    path: string = '/vehicles';
    router: Router = Router();
    vehicleService: VehicleService;

    constructor() {
        this.vehicleService = new VehicleService();
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(this.path, this.vehicleService.getVehicles);
        this.router.get(`${this.path}/:id`, this.vehicleService.getVehicle);
        this.router
            .all(`${this.path}`, [AuthenticationMiddleware, AuthorizationMiddleware('ADMIN')], )
            .patch(`${this.path}/:id`, [Validator.object(VehicleDto, true), Validator.param('id', true)], this.vehicleService.updateVehicle)
            .delete(`${this.path}/:id`, Validator.param('id', true), this.vehicleService.deleteVehicle)
            .post(this.path, Validator.object(VehicleDto), this.vehicleService.addVehicle);
    }
}
