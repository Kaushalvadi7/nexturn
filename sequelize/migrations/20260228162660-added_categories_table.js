"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "categories",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    name: { type: Sequelize.STRING(255), allowNull: false },
                    description: { type: Sequelize.TEXT },
                    applications: { type: Sequelize.JSONB, defaultValue: [] },
                    is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
                    sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("categories", { transaction: t });
        });
    },
};
