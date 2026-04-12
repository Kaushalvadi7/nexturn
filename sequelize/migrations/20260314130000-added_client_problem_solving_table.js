"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "client_problem_solving",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    client_name: { type: Sequelize.STRING(255), allowNull: false },
                    product_name: { type: Sequelize.STRING(255), allowNull: false },
                    client_location: { type: Sequelize.STRING(255), allowNull: false },
                    year: { type: Sequelize.INTEGER, allowNull: false },
                    challange: { type: Sequelize.TEXT },
                    solution: { type: Sequelize.TEXT },
                    results: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("client_problem_solving", { transaction: t });
        });
    },
};

