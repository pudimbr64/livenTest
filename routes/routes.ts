import express from 'express';
import userController from '../controller/userController';
import authController from '../controller/authController';
import addressController from '../controller/addressController';
import jwtMiddlware from '../utils/jwtMiddleware';
const swaggerUi = require('swagger-ui-express');
import swaggerDocument from "../swagger.json";

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);


router.get('/api-docs', swaggerUi.setup(swaggerDocument)); //docs
router.post('/createUser', userController.createUser);  //does not need auth
router.get('/getUserData', jwtMiddlware, userController.getUserData);
router.delete('/deleteUser', jwtMiddlware, userController.deleteUser);
router.post('/alterUser', jwtMiddlware, userController.alterUser);
router.post('/login', authController.authUser); //returns token
router.post('/createAddress', jwtMiddlware, addressController.createAddress);
router.get('/getAddress/:pathId', jwtMiddlware, addressController.getAddress);
router.get('/getAddress', jwtMiddlware, addressController.getAddress);
router.post('/alterAddress', jwtMiddlware, addressController.alterAddress);
router.delete('/deleteAddress/:addressId', jwtMiddlware, addressController.deleteAddress);




export default router;