import authController from "../../controller/authController";
import { getMockReq, getMockRes } from '@jest-mock/express'
import knex from 'knex';
import mockDb from "mock-knex";


const db = knex({
    client: 'mysql2',
});
mockDb.mock(db);

const tracker = require('mock-knex').getTracker();

tracker.install();

describe('Tests loging in', () => {

    test('Should return a success', async () => {
        const { res } = getMockRes({
            success: true,
            token: "random string"
        })
        const req = getMockReq({
            body: {
                email: "testuser@email.com",
                password: "pass123"
            }
        })

        tracker.on('query', function sendResult(query) {
            query.response({
                salt: 'b8dcea1728e89638ebc91ab548fa875e',
                hash: 'f6ba2ac862ee13f67f44c43348b2e1eb8a0c85e7a9afda331a21b858b957fd555974bfd040afb8fc7c768cf9ab116b77ebd8463b20fd29255d9c8e2e5af98594',
            });
        });

        await authController.authUser(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, token: expect.anything()}), // its an unpredictable string, still it ensures "token" is returned
        );
    });

    test('Should return a failure because of wrong password', async () => {
        const { res } = getMockRes({
            success: true,
            token: "random string"
        })
        const req = getMockReq({
            body: {
                asd: "Test User",
                birthdate: "1993-11-04",
                password: "pass1234",
                email: "newTestUser3@email.com"
            }
        })
        await authController.authUser(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: "Invalid Password"
            }),
        )
    })

    test('Should return a failure because user does not exist', async () => {
        const { res } = getMockRes({
            success: true,
            token: "random string"
        });

        const req = getMockReq({
            body: {
                asd: "Test User",
                birthdate: "1993-11-04",
                password: "pass1234",
                email: "newTestUser3@email.com"
            }
        });

        tracker.on('query', function sendResult(query) {
            query.response({});
        });
        
        await authController.authUser(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: "User not found."
            }),
        )
    })
})
