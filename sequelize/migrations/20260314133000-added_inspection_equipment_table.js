"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "inspection_equipment",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    title: { type: Sequelize.STRING(255), allowNull: false },
                    icon_name: { type: Sequelize.STRING(255) },
                    measurement: { type: Sequelize.STRING(255), allowNull: false },
                    accuracy: { type: Sequelize.STRING(255), allowNull: false },
                    application: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("inspection_equipment", { transaction: t });
        });
    },
};
