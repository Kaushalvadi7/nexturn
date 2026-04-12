"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.addColumn(
                "categories",
                "process",
                { type: Sequelize.TEXT, allowNull: true },
                { transaction: t },
            );

            await queryInterface.addColumn(
                "categories",
                "surface_finish",
                { type: Sequelize.TEXT, allowNull: true },
                { transaction: t },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.removeColumn("categories", "surface_finish", {
                transaction: t,
            });
            await queryInterface.removeColumn("categories", "process", {
                transaction: t,
            });
        });
    },
};
