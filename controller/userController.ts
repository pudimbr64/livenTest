import connection from "../database/connection";
import { Request, RequestHandler, Response } from 'express';
import authUtil from '../utils/authUtil';
import User from '../interfaces/userInterface';
import { JwtPayload } from "jsonwebtoken";
import Address from "../interfaces/addressInterface";
import checkEmpty from "../utils/checkEmpty";

interface UserController {
    createUser: RequestHandler,
    getUserData: RequestHandler,
    deleteUser: RequestHandler,
    alterUser: RequestHandler
}


const userController: UserController = {

    createUser: async (req: Request, res: Response) => {
        try {
            const { name, birthdate, password, email } = req.body;
            if (!name || !birthdate || !password || !email)
                throw "Missing Information.";

            //returns hash and salt to be later cusumed by verification util
            const { hash, salt } = await authUtil.makeHash(password);
            await connection('users').insert({ name: name, birthdate: birthdate, hash: hash, salt: salt, email: email });

            res.status(200).json({
                success: true,
                message: "User created!"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },

    getUserData: async (req: Request, res: Response) => {
        try {
            const userDataValid = JSON.parse(req.params.userDataValid);

            const userId: Number = userDataValid.id;
            if (!userId)
                throw "Missing info."

            let addressArray: Array<Address> = await connection('addresses').where('userId', userId).select('*');
            let retrievedUserData: User = { ...await connection('users').where('id', userId).select('*').first() };

            //reorganiza o objeto alocando todos as entradas para apenas um usuário
            const userData: JwtPayload = { ...retrievedUserData, address: addressArray }
            res.status(200).json({
                success: true,
                userData: userData
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        try {

            const userDataValid = JSON.parse(req.params.userDataValid);

            // if (!userDataValid.id)
            //     throw "Missing ID!";

            let userData: User = { ...await connection('users').select('id').where('id', userDataValid.id).first() };
            if (!checkEmpty(userData)) {
                await connection('users').del('users').where('id', userDataValid.id);

                res.status(200).json({
                    success: true,
                    message: "User deleted."
                });
            } else {
                throw "Usuário não existe.";
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },
    alterUser: async (req: Request, res: Response) => {
        try {
            if (checkEmpty(req.body))
                throw "Missing information!";

            let newUserData = { ...req.body };

            const userDataValid = JSON.parse(req.params.userDataValid);
            let userData: User = { ...await connection('users').select('id').where('id', userDataValid.id).first() };
            if (!checkEmpty(userData)) {
                await connection('users').where('id', userData.id).update(newUserData);

                res.status(200).json({
                    success: true,
                    message: "User altered."
                });
            } else {
                throw "Usuário não existe.";
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },
}

export default userController;