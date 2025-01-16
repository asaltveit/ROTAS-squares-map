const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Location = db.define('locations', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdYearStart: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 0,
        max: 2030,
    },
    createdYearEnd: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2030,
        isAfterCreatedYearStart(value) {
            if (value <= this.createdYearStart) {
              throw new Error('createdYearEnd must be after createdYearStart.');
            }
        }
    },
    discoveredYear: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2030,
    },
    longitude: {
        type: DataTypes.REAL,
        defaultValue: 0,
        min: -180,
        max: 180,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.REAL,
        defaultValue: 0,
        min: -90,
        max: 90,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
    },
    place: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    script: {
        type: DataTypes.STRING,
    },
    shelfmark: {
        type: DataTypes.STRING,
    },
    firstWord: {
        type: DataTypes.STRING,
    },
});
module.exports = Location;