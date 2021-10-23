import {Document, Model} from "mongoose";
import {UserDocument} from "../user/UserDto";
import {IsArray, IsBoolean, IsEmail, IsIn, IsOptional, Length, Max, Min} from "class-validator";

export interface VehicleBrandDocument extends Document{
    name: string;
    logoUrl: string;

}

export interface VehicleDocument extends Document{
    regNumber: string;
    type: string;
    brand: VehicleBrandDocument['_id'];
    owner: UserDocument['_id'];
    averageReviews?: number;
    health?: number;
    active: boolean;
    images: string[];
    createdBy: string;
}

export interface VehiclePopulatedDocument {
    brand: VehicleBrandDocument
    owner: UserDocument
}

export class VehicleDto {
    @Length(6, 15)
    regNumber: string;
    @IsIn(['TRUCK', 'CAR', 'BUS'])
    type: string;
    @Length(24, 24)
    brand: string;
    @Length(24, 24)
    owner: string;
    @IsOptional()
    @Min(1)
    @Max(5)
    health?: number;
    @IsBoolean()
    active: boolean;
    @IsArray()
    @IsOptional()
    images?: string[];
    @IsEmail()
    createdBy?: string;
}
