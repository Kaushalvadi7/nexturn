"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "manufacturing_capabilities",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    title: { type: Sequelize.STRING(255), allowNull: false },
                    description: { type: Sequelize.TEXT },
                    feature: { type: Sequelize.JSONB },
                    icon_name: { type: Sequelize.STRING(255) },
                    sort_order: { type: Sequelize.INTEGER },
                    is_active: { type: Sequelize.BOOLEAN },
                    created_at: { type: Sequelize.DATE },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("manufacturing_capabilities", { transaction: t });
        });
    },
};
