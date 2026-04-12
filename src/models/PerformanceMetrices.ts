import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "performance_metrices", timestamps: false })
export default class InfoTable extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare field: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare value: string;

    @Column(DataType.STRING(255))
    declare icon_name: string | null;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    declare view_in_hero_page: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    declare view_in_about_us: boolean;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
