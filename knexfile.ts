require('ts-node').register();
// require('dotenv').config({ path: './' })
const { config } = require('./utils/databaseUtil').default;
module.exports = {
  development: {
    ...config,
    migrations: {
      directory: './database/migrations'
    }
  }
};
