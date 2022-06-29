import crypto from 'crypto';
import User from '../interfaces/userInterface';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';


const authUtil = {

    makeHash: async (password: string) => {

        const salt = crypto.randomBytes(16).toString('hex');

        return { hash: crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'), salt: salt };

    },

    verifyPassword: async (password: string, userHash: string, salt: string) => {

        let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash === userHash;
    },

    jwtGenerateToken: async (userData: User, JWT_SECRET_KEY: string) => {
        return await jsonwebtoken.sign(userData, JWT_SECRET_KEY as string, { expiresIn: '24h' });
    },

    jwtAuthenticate: async (token: string, JWT_SECRET_KEY: string) => {
        let splitToken;
        if (token) {
            splitToken = token.split(' ')[1];
            return await jsonwebtoken.verify(splitToken, JWT_SECRET_KEY) as JwtPayload;
        }
        throw ("Unauthorized!!");
    }

}

export default authUtil;