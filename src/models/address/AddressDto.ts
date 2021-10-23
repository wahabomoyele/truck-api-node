import {Document} from 'mongoose';
import {UserDocument} from "../user/UserDto";
import {Length} from "class-validator";

export interface AddressDocument extends Document{
    country: string;
    state: string;
    city: string;
    street: string;
    postalCode?: string;
    contact: UserDocument['_id']
}


export class AddressDto {
    @Length(3, 20)
    country: string;
    @Length(3, 50)
    state: string;
    @Length(3, 100)
    city: string;
    @Length(3, 50)
    street: string;
    postalCode?: string;
    @Length(24, 24)
    contact: string
}
