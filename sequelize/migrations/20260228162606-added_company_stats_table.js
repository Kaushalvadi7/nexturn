
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "company_stats",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
                    value: { type: Sequelize.STRING(255), allowNull: false },
                    label: { type: Sequelize.STRING(255) },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("company_stats", { transaction: t });
        });
    },
};
