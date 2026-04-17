"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "company_profile_downloads",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    name: { type: Sequelize.STRING(255), allowNull: false },
                    email: { type: Sequelize.STRING(255), allowNull: false },
                    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                },
                { transaction: t },
            );

            await queryInterface.addIndex("company_profile_downloads", ["name"], {
                name: "idx_company_profile_downloads_name",
                transaction: t,
            });
            await queryInterface.addIndex("company_profile_downloads", ["email"], {
                name: "idx_company_profile_downloads_email",
                transaction: t,
            });
            await queryInterface.addIndex("company_profile_downloads", ["created_at"], {
                name: "idx_company_profile_downloads_created_at",
                transaction: t,
            });
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("company_profile_downloads", { transaction: t });
        });
    },
};
