import dotenv from 'dotenv';

dotenv.config();

const config = {
  config: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    }
  }
}

export default config;