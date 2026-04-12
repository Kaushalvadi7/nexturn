"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "regions",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    country: { type: Sequelize.STRING(255), allowNull: false },
                    state: { type: Sequelize.STRING(255), allowNull: false },
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
            await queryInterface.dropTable("regions", { transaction: t });
        });
    },
};
