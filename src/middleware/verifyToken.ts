import jwt from 'jsonwebtoken';
import { userModel } from '../model/userModel';

import { promises as fsPromises } from 'fs';
import * as path from 'path';


export default async function verifyToken (req: any, res: any, next?: any) {

    // Getting values from env for verifyOptions
    let verifyOptions: jwt.SignOptions = {
        issuer: process.env.jwt_iss,
        subject: process.env.jwt_sub,
        audience: process.env.jwt_aud,
        expiresIn: process.env.jwt_exp,
        algorithm: "RS256"
    };


    let public_key = "";

    try {
        public_key = await fsPromises.readFile(
            path.join(__dirname, '../public.key'),
            { encoding: 'utf-8' },
        );
    }
    catch (err) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }

    try {
        // Fetching the token , if not available returning a response 
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).send({ success: false, message: 'No Token Provided ' });
        const decoded: any = jwt.verify(token, public_key, verifyOptions);
        const user = await userModel.findOne({ _id: decoded.id });
        // saving the user information into request as a user key;
        // console.log('User', user);
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).send({ success: false, message: 'Authentication failed' });
    }

}