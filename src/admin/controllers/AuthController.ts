import Controller from "./Controller";
import {Router} from "express";
import {UserService} from "../services/user";
import {Validator} from "../../middleware/validator";

export class AuthController implements Controller {
    path: string = '/auth/user';
    router: Router = Router();
    userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(this.path, Validator.query('email'), this.userService.getUserForAuth);
    }
}
