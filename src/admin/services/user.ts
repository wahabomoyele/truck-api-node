import BadRequestError from '../../errors/bad-request-error'
import {UserModel} from "../../models/user/User";
import {Request, Response} from "express"
import {UserDto} from "../../models/user/UserDto";
import {StatusCodes} from "http-status-codes/build/cjs";



export class UserService {

    createUser = async (request: Request, response: Response) => {

        const user = request.body as UserDto;

        // The 'unique' option is not a validator so
        // duplicate check fails when the index has not been built
        const emailAlreadyExists = await UserModel.findOne({ email: user.email });
        if (emailAlreadyExists) {
            throw new BadRequestError('Email already exists');
        }


        // All new users start out as a 'CUSTOMER'.
        // Registering a vehicle adds the 'OWNER' role to a user
        // Admins can assign 'PARTNER' roles
        user.roles = ['CUSTOMER']


        let {_id, name, email, phoneNumber, roles} = await UserModel.create(user)
        return response.status(StatusCodes.CREATED).json({_id, name, email, phoneNumber, roles})
    }

    getUsers = async (request: Request, response: Response) => {
        const users = await UserModel.find({}).select('-password')
        return response.status(StatusCodes.OK).json(users);
    }

    getUser = async (request: Request, response: Response) => {
        const id = request.params.id
        const user = await UserModel.findById(id).select('-password')
        return response.status(StatusCodes.OK).json(user)
    }

    updateUser = async (request: Request, response: Response) => {
        const id = request.params.id
        const update = request.body
        const user = await UserModel.findById(id)
        delete update.password
        delete update.email
        if(user) {
            Object.assign(user, update)
            await user.save()
        }
        response.status(StatusCodes.OK).json(user)
    }

    deleteUser = async (request: Request, response: Response) => {
        const id = request.params.id
        await UserModel.findByIdAndRemove(id)
        return response.status(StatusCodes.OK)
    }

    getUserForAuth = async (request: Request, response: Response) => {
        const email = request.query.email as string
        const user = await UserModel.findOne({email})
        if(!user) throw new BadRequestError('')

        // Authentication server is using Spring security. Roles must have 'ROLE_' prefix
        const r: any = []
        user.roles.forEach((role: string) => {
            r.push('ROLE_' + role)
        })
        user.roles = r
        user.isActive = true
        return response.status(StatusCodes.OK).json(user)
    }
}
