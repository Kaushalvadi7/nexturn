"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "performance_metrices",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    field: { type: Sequelize.STRING(255), allowNull: false },
                    value: { type: Sequelize.STRING(255), allowNull: false },
                    icon_name: { type: Sequelize.STRING(255) },
                    view_in_hero_page: { type: Sequelize.BOOLEAN, defaultValue: false },
                    created_at: { type: Sequelize.DATE },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("performance_metrices", { transaction: t });
        });
    },
};
