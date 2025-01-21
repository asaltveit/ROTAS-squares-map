module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('locations', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdYearStart: {
                type: Sequelize.INTEGER,
                allowNull: false,
                min: 0,
                max: 2030,
            },
            createdYearEnd: {
                type: Sequelize.INTEGER,
                min: 0,
                max: 2030,
                isAfterCreatedYearStart(value) {
                    if (value <= this.createdYearStart) {
                      throw new Error('createdYearEnd must be after createdYearStart.');
                    }
                }
            },
            discoveredYear: {
                type: Sequelize.INTEGER,
                min: 0,
                max: 2030,
            },
            longitude: {
                type: Sequelize.REAL,
                defaultValue: 0,
                min: -180,
                max: 180,
                allowNull: false,
            },
            latitude: {
                type: Sequelize.REAL,
                defaultValue: 0,
                min: -90,
                max: 90,
                allowNull: false,
            },
            text: {
                type: Sequelize.STRING,
            },
            place: {
                type: Sequelize.STRING,
            },
            location: {
                type: Sequelize.STRING,
            },
            script: {
                type: Sequelize.STRING,
            },
            shelfmark: {
                type: Sequelize.STRING,
            },
            firstWord: {
                type: Sequelize.STRING,
            },
        },
        {
            underscored: true,
        });
    },
   down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};