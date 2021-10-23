import Controller from "./Controller";
import {Router} from "express";
import {AuthenticationMiddleware, AuthorizationMiddleware} from "../../middleware/auth";
import {UserService} from "../services/user";
import {Validator} from "../../middleware/validator";
import {UserDto} from "../../models/user/UserDto";

export class UserController implements Controller{
    path: string = '/users';
    router: Router = Router();
    userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(this.path, this.userService.getUsers);
        this.router.get(`${this.path}/:id`, Validator.param('id', true), this.userService.getUser);
        this.router
            .all(`${this.path}/*`, [AuthenticationMiddleware, AuthorizationMiddleware('ROLE_ADMIN')], )
            .patch(`${this.path}/:id`, [Validator.object(UserDto, true), Validator.param('id', true)], this.userService.updateUser)
            .delete(`${this.path}/:id`, this.userService.deleteUser)
            .post(this.path, Validator.object(UserDto), this.userService.createUser);
    }
}
