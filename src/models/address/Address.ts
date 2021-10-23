import {Schema, Types} from "mongoose";
import {AddressDocument} from "./AddressDto";

export const AddressSchema = new Schema<AddressDocument>({
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    postalCode: {
        type: String
    },
    contact: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Address contact is required']
    }
})
