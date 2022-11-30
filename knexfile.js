require('dotenv').config();

const { DB_NAME, DB_USER, DB_PASSWORD } = process.env;

module.exports = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    charset: "utf8",
  },
};
