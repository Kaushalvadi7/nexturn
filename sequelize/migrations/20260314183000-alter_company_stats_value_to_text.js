
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.changeColumn(
                "company_stats",
                "value",
                { type: Sequelize.TEXT, allowNull: false },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.changeColumn(
                "company_stats",
                "value",
                { type: Sequelize.STRING(255), allowNull: false },
                { transaction: t },
            );
        });
    },
};

