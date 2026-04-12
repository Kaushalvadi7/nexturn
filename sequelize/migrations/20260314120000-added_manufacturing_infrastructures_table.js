"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "Manufacturing_infrastructures",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    title: { type: Sequelize.STRING(255), allowNull: false },
                    description: { type: Sequelize.TEXT },
                    points: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("Manufacturing_infrastructures", { transaction: t });
        });
    },
};

