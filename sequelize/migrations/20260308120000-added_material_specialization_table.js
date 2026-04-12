"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "material_specialization",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    image_url: { type: Sequelize.TEXT },
                    public_url: { type: Sequelize.TEXT },
                    title: { type: Sequelize.STRING(255), allowNull: false },
                    description: { type: Sequelize.TEXT },
                    grades: { type: Sequelize.JSONB },
                    common_application: { type: Sequelize.JSONB },
                    created_at: { type: Sequelize.DATE },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("material_specialization", { transaction: t });
        });
    },
};
