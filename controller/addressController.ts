import connection from "../database/connection";
import { Request, RequestHandler, Response } from 'express';
import Address from '../interfaces/addressInterface';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import checkCountry from "../utils/countryCodes";
import checkEmpty from "../utils/checkEmpty";

interface AddressController {
    createAddress: RequestHandler,
    getAddress: RequestHandler,
    alterAddress: RequestHandler,
    deleteAddress: RequestHandler,
}

dotenv.config();


const addressController: AddressController = {

    createAddress: async (req: Request, res: Response) => {
        try {
            const { street, addressName, number, country, city, neighborhood, zipcode, } = req.body;

            if (!street || !addressName || !number || !country || !neighborhood || !city || !zipcode)
                throw "Missing info.";

            const userData: JwtPayload = JSON.parse(req.params.userDataValid);
            if (!checkCountry(country))
                throw ("Còdigo de país inválido");
            await connection('addresses').insert({ userId: userData.id, addressName, street, number, country, city, neighborhood, zipcode });
            res.status(200).json({
                success: true,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },
    getAddress: async (req: Request, res: Response) => {
        try {
            const { country } = req.query;
            const { pathId } = req.params;

            const userData: JwtPayload = JSON.parse(req.params.userDataValid);

            if(!userData.id)
                throw "Missing User ID!";

            if (country && !checkCountry(country as string))
                throw ("Còdigo de país inválido");

            const addressList: Array<Address> = await connection('addresses').select('*').where((builder: any) => {
                if (pathId && country)
                    builder.where('userId', userData.id).andWhere('id', pathId).orWhere('country', country);
                if (!country && pathId)
                    builder.where('userId', userData.id).andWhere('id', pathId);
                if (!pathId && country)
                    builder.where('userId', userData.id).andWhere('country', country);

                //all else fails
                builder.where('userId', userData.id);
            });

            if (addressList.length < 1)
                throw "Address does not exist."

            res.status(200).json({
                success: true,
                addressList
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },

    alterAddress: async (req: Request, res: Response) => {
        try {
            if (!req.body.addressId || !req.body.newAddressData)
                throw "Missing information!";

            let { addressId, newAddressData } = req.body;

            const userDataValid = JSON.parse(req.params.userDataValid);

            let addressData: Address = { ...await connection('addresses').select('*').where('id', addressId).andWhere('userId', userDataValid.id).first() };
            if (!checkEmpty(addressData)) {
                await connection('addresses').where('id', addressData.id).update(newAddressData);
                res.status(200).json({
                    success: true,
                    message: "Address updated!"
                });
            } else {
                throw "Endereço não existe.";
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },

    deleteAddress: async (req: Request, res: Response) => {
        try {
            if (!req.params.addressId)
                throw "Missing Identifier";

            const { addressId } = req.params;

            const userDataValid = JSON.parse(req.params.userDataValid);

            let addressData: Address = { ...await connection('addresses').select('*').where('id', addressId).andWhere('userId', userDataValid.id).first() };
            if (!checkEmpty(addressData)) {
                await connection('addresses').del('addresses').where('id', addressData.id);
                res.status(200).json({
                    success: true,
                    message: "Address deleted!"
                });
            } else {
                throw "Endereço não existe.";
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Ocorreu um erro. " + err,
            });
        }
    },
}

export default addressController;