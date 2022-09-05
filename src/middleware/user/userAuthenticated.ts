import jwt from 'jsonwebtoken';


import { promises as fsPromises } from 'fs';
import * as path from 'path';

export async function isUserAuthenticated (req: any, res: any) {
    let verifyOptions = {
        issuer: process.env.jwt_iss,
        subject: process.env.jwt_sub,
        audience: process.env.jwt_aud,
        expiresIn: process.env.jwt_exp,
        algorithm: process.env.jwt_algo
    };

    let public_key = "";
    try {
        public_key = await fsPromises.readFile(
            path.join(__dirname, '../../public.key'),
            { encoding: 'utf-8' },
        );
    }
    catch (err) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }

    try {
        // Fetching the token , if not available returning a flag u-empty
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return 'u-empty';
        // Verifying the JWT token , if verified returning a flag u-token
        const decoded: any = jwt.verify(token, public_key, verifyOptions);
        return 'u-token';
    }
    catch (err) {
        return 'u-empty';
    }
}