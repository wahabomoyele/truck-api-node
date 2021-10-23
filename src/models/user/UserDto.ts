import {Document} from "mongoose";
import {IsArray, IsBoolean, IsEmail, IsOptional, IsString, Length, ValidateNested} from "class-validator";
import {AddressDocument} from "../address/AddressDto";

export interface UserDocument extends Document{
    name: string;
    email: string;
    phoneNumber: string;
    address?: AddressDocument
    password: string;
    roles: string[];
    isActive: boolean;
}

export class UserDto {
    @IsString()
    public name: string;
    @IsEmail()
    public email: string;
    @Length(6, 15)
    public phoneNumber: string;
    @ValidateNested()
    public address?: AddressDocument
    public password: string;
    @IsArray()
    @IsOptional()
    public roles: string[];
    @IsBoolean()
    @IsOptional()
    public isActive: boolean;
}
