import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { promises as fsPromises } from 'fs';
import * as path from 'path';


export interface User {
    _id?: number,   // optional remove
    name: string,
    email: string,
    password: string,
    maritalStatus: number,
    mobile: number,
    city: string;
}


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    maritalStatus: {
        type: Number,
        required: true,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });



export const userModel = mongoose.model('User', userSchema);


// return JWT-RSA Token , 
export async function generateRsaToken (userInfo: User) {

    let payload: any = {};

    payload.id = userInfo._id;
    payload.name = userInfo.name;
    payload.email = userInfo.email;


    let options: jwt.SignOptions = {
        issuer: process.env.jwt_iss,
        subject: process.env.jwt_sub,
        audience: process.env.jwt_aud,
        expiresIn: process.env.jwt_exp,
        algorithm:  "RS256"
    };


    let private_key = "";

    private_key = await fsPromises.readFile(
        path.join(__dirname, '../private.key'),
        { encoding: 'utf-8' },
    );

    const token = await jwt.sign(payload, private_key, options);
    return token;

}



