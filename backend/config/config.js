require('dotenv').config()

const config = {
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  server: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 4000,
  },
}

module.exports = config
