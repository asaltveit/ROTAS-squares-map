const Sequelize = require('sequelize');
require('dotenv').config(); // Or .parse() for security?

module.exports = new Sequelize('rotasdb', process.env.USERNAME, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
});