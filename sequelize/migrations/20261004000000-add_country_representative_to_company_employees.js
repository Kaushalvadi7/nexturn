"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.addColumn(
                "company_employees",
                "country_representative",
                {
                    type: Sequelize.STRING(255),
                    allowNull: true,
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.removeColumn("company_employees", "country_representative", {
                transaction: t,
            });
        });
    },
};