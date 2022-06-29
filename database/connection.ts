
import dotenv from 'dotenv';
import config from '../utils/databaseUtil';


const knex = require('knex');

dotenv.config();

let connection = knex(config.config);

export default connection;
