"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "images",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    entity_type: { type: Sequelize.STRING(50), allowNull: false },
                    entity_id: { type: Sequelize.INTEGER, allowNull: false },
                    image_url: { type: Sequelize.STRING(500), allowNull: true },
                    public_id: { type: Sequelize.STRING(255), allowNull: true },
                    is_primary: { type: Sequelize.BOOLEAN, defaultValue: false },
                    sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("images", { transaction: t });
        });
    },
};
