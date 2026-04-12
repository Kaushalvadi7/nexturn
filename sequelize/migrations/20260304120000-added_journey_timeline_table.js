"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "journey_timeline",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    year: { type: Sequelize.INTEGER, allowNull: false },
                    title: { type: Sequelize.STRING(255), allowNull: false },
                    description: { type: Sequelize.TEXT, allowNull: false },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("journey_timeline", { transaction: t });
        });
    },
};
