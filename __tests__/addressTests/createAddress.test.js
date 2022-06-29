import addressController from "../../controller/addressController";
import { getMockReq, getMockRes } from '@jest-mock/express'
import knex from 'knex';
import mockDb from "mock-knex";

const db = knex({
    client: 'mysql2',
});
mockDb.mock(db);

describe('Tests creating an address to logged user', () => {

    test('Should return a success', async () => {
        const { res } = getMockRes({
            success: true,
        })
        const req = getMockReq({
            params: {
                userDataValid: JSON.stringify({
                    id: 19,
                    name: 'Test User',
                    birthdate: '1993-11-04',
                    salt: '8b34d5acc8759c67066b8baf212cd7b4',
                    hash: '97ec64f14ff9b6b1e857adefb9770bc331929d51a1948f2227979a13496883978fa9340753ef5adc47aa981d032bff99114e26b2359991db280ad2819ddfa43b',
                    email: 'amigo2@email.com',
                    iat: 1656427264,
                    exp: 1656513664
                })
            },
            body: {
                street: "rua legal",
                addressName: "Casa da Mãe",
                number: "209",
                country: "BR",
                city: "sjc daora",
                neighborhood: "bairo do mal",
                zipcode: "12233900"
            }
        });

        await addressController.createAddress(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true
            }),
        )
    })

    test('Should return a failure', async () => {
        const { res } = getMockRes({
            success: true,
        })
        const req = getMockReq({
            params: {
                userDataValid: JSON.stringify({

                })
            }
        });

        await addressController.createAddress(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: "Ocorreu um erro. Missing info."
            }),
        )
    })
})
