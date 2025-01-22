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
    created_year_start: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 0,
        max: 2030,
    },
    created_year_end: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2030,
    },
    discovered_year: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2030,
    },
    longitude: {
        type: DataTypes.REAL,
        //defaultValue: 0, // Is this needed?
        min: -180,
        max: 180,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.REAL,
        //defaultValue: 0, // Is this needed?
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
    first_word: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
    },
},
{
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
module.exports = Location;


/*
created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

*/