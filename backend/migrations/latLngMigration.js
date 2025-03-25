'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'locations',
            'fixed_latitude',
            {
                type: Sequelize.DataTypes.REAL,
                allowNull: false,
                min: -90,
                max: 90,
            },
        )
        await queryInterface.addColumn(
            'locations',
            'fixed_longitude',
            {
                type: Sequelize.DataTypes.REAL,
                allowNull: false,
                min: -180,
                max: 180,
            },
        )
    },
    async down (queryInterface, Sequelize) {
          queryInterface.removeColumn('locations', 'fixed_latitude')
          queryInterface.removeColumn('locations', 'fixed_longitude')
    },
  };