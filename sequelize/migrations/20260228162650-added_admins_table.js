"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "admins",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
                    password_hash: { type: Sequelize.STRING(500), allowNull: false },
                    name: { type: Sequelize.STRING(255) },
                    created_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("admins", { transaction: t });
        });
    },
};
