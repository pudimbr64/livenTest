import userController from "../../controller/userController";
import { getMockReq, getMockRes } from '@jest-mock/express'
import knex from 'knex';
import mockDb from "mock-knex";

const db = knex({
  client: 'mysql2',
});
mockDb.mock(db);


describe('Tests creating an user', () => {

  test('Should return a success', async () => {
    const { res } = getMockRes({
      success: true,
      message: "User created!"
    })
    const req = getMockReq({
      body: {
        name: "Test User",
        birthdate: "1993-11-04",
        password: "pass123",
        email: "newTestUser3@email.com"
      }
    })
    await userController.createUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "User created!"
      }),
    )
  });

  test('Should return a failure', async () => {
    const { res } = getMockRes({
      success: true,
      message: "User created!"
    })
    const req = getMockReq({
      body: {
        asd: "Test User",
        birthdate: "1993-11-04",
        password: "pass123",
        email: "newTestUser3@email.com"
      }
    })
    await userController.createUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "Ocorreu um erro. Missing Information."
      }),
    )
  })
})
