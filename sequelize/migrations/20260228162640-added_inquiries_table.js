"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "inquiries",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    full_name: { type: Sequelize.STRING(255), allowNull: false },
                    email: { type: Sequelize.STRING(255), allowNull: false },
                    phone: { type: Sequelize.STRING(50), allowNull: true },
                    company_name: { type: Sequelize.STRING(255) },
                    category_name: { type: Sequelize.STRING },
                    subject: { type: Sequelize.STRING(500) },
                    message: { type: Sequelize.TEXT, allowNull: false },
                    status: { type: Sequelize.STRING(50) },
                    is_viewed: { type: Sequelize.BOOLEAN },
                    created_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("inquiries", { transaction: t });
        });
    },
};
