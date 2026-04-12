"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.createTable(
                "export_regions",
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    country_code: { type: Sequelize.STRING(2), allowNull: false },
                    state_name: { type: Sequelize.STRING(120), allowNull: false },
                    created_at: { type: Sequelize.DATE },
                    updated_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );

            await queryInterface.addIndex("export_regions", ["country_code"], {
                name: "idx_export_regions_country_code",
                transaction: t,
            });

            await queryInterface.addConstraint("export_regions", {
                fields: ["country_code", "state_name"],
                type: "unique",
                name: "uq_export_regions_country_state",
                transaction: t,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async t => {
            await queryInterface.dropTable("export_regions", { transaction: t });
        });
    },
};
