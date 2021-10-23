import 'dotenv/config';
import {App} from './App';
import {UserController} from "./admin/controllers/UserController";
import {VehicleController} from "./admin/controllers/VehicleController";
import {AuthController} from "./admin/controllers/AuthController";

const application = new App(
    [
        new UserController(),
        new VehicleController(),
        new AuthController()
    ],
);
application.listen();
