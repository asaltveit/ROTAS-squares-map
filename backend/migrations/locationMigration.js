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
        });
        /*await queryInterface.addColumn('location', 'uuid', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true,
        });
        await queryInterface.addColumn('location', 'type', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.addColumn('location', 'createdYearStart', {
            type: Sequelize.INTEGER,
            allowNull: false,
            min: 0,
            max: 2030,
        });
        await queryInterface.addColumn('location', 'createdYearEnd', {
            type: Sequelize.INTEGER,
            min: 0,
            max: 2030,
            isAfterCreatedYearStart(value) {
                if (value <= this.createdYearStart) {
                    throw new Error('createdYearEnd must be after createdYearStart.');
                }
            }
        });
        await queryInterface.addColumn('location', 'discoveredYear', {
            type: Sequelize.INTEGER,
            min: 0,
            max: 2030,
        });
        await queryInterface.addColumn('location', 'longitude', {
            type: Sequelize.REAL,
            defaultValue: 0,
            min: -180,
            max: 180,
            allowNull: false,
        });
        await queryInterface.addColumn('location', 'latitude', {
            type: Sequelize.REAL,
            defaultValue: 0,
            min: -90,
            max: 90,
            allowNull: false,
        });
        await queryInterface.addColumn('location', 'text', {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('location', 'place', {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('location', 'location', {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('location', 'script', {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('location', 'shelfmark', {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('location', 'firstWord', {
            type: Sequelize.STRING,
        }); */
    },
   down: async (queryInterface, Sequelize) => {
        /*await queryInterface.removeColumn('location', 'uuid');
        await queryInterface.removeColumn('location', 'type');
        await queryInterface.removeColumn('location', 'createdYearStart');
        await queryInterface.removeColumn('location', 'createdYearEnd');
        await queryInterface.removeColumn('location', 'discoveredYear');
        await queryInterface.removeColumn('location', 'longitude');
        await queryInterface.removeColumn('location', 'latitude');
        await queryInterface.removeColumn('location', 'text');
        await queryInterface.removeColumn('location', 'place');
        await queryInterface.removeColumn('location', 'location');
        await queryInterface.removeColumn('location', 'script');
        await queryInterface.removeColumn('location', 'shelfmark');
        await queryInterface.removeColumn('location', 'firstWord');*/
        await queryInterface.dropTable('Users');
    }
};