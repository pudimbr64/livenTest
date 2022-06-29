import connection from "../database/connection";
import { Request, RequestHandler, Response } from 'express';
import User from '../interfaces/userInterface';
import authUtil from '../utils/authUtil';
import dotenv from 'dotenv';
import checkEmpty from "../utils/checkEmpty";

interface AuthController {
    authUser: RequestHandler
}

dotenv.config();

const authController: AuthController = {

    authUser: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userData: User = {
                ...await connection('users').where({
                    email: email
                }).select('*').first()
            };

            //verifica existencia de usuário em questão
            if (checkEmpty(userData))
                return res.status(400).json({
                    success: false,
                    error: "User not found.",
                })
            //valida senha inserida de acordo com hash e salt guardados em banco e autentica
            if (await authUtil.verifyPassword(password, userData.hash, userData.salt)) {
                const jwt_token = process.env.JWT_SECRET_KEY;
                //valida se secret key existe
                if (!jwt_token) return res.status(401).json({
                    success: false,
                    error: "Missing JWT secret key",
                })
                res.status(200).json({
                    success: true,
                    token: await authUtil.jwtGenerateToken(userData, jwt_token),
                });
            } else {
                return res.status(401).json({
                    success: false,
                    error: "Invalid Password",
                })
            }

        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },

}

export default authController;