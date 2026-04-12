"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "client_success_stories",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    stars: { type: Sequelize.INTEGER },
                    client_name: { type: Sequelize.STRING(255), allowNull: false },
                    client_position: { type: Sequelize.STRING },
                    client_city: { type: Sequelize.STRING },
                    description: { type: Sequelize.TEXT },
                    client_purchase: { type: Sequelize.STRING },
                    is_active: { type: Sequelize.BOOLEAN },
                    sort_order: { type: Sequelize.INTEGER },
                    created_at: { type: Sequelize.DATE },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("client_success_stories", { transaction: t });
        });
    },
};
