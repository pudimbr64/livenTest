import { Request, RequestHandler, Response, NextFunction } from 'express';
import authUtil from './authUtil';

import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();


const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];

        const userDataValid: JwtPayload = await authUtil.jwtAuthenticate(token as string, process.env.JWT_SECRET_KEY as string);
        if (!userDataValid) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }
        req.params = { ...req.params, userDataValid: JSON.stringify(userDataValid) };
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }
}

export default jwtMiddleware;