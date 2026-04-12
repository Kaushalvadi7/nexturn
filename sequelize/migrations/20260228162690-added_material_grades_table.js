"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "material_grades",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    entity_type: { type: Sequelize.STRING(50), allowNull: false },
                    entity_id: { type: Sequelize.INTEGER, allowNull: false },
                    grade: { type: Sequelize.STRING(255), allowNull: false },
                    standard: { type: Sequelize.STRING(100) },
                    notes: { type: Sequelize.STRING(500) },
                    sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
                },
                { transaction: t },
            );
            await queryInterface.addIndex("material_grades", {
                name: "idx_material_grades_entity",
                fields: ["entity_type", "entity_id"],
                transaction: t,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("material_grades", { transaction: t });
        });
    },
};
