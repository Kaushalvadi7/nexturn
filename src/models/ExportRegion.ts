import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "export_regions", timestamps: false })
export default class ExportRegion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(2), allowNull: false })
    declare country_code: string;

    @Column({ type: DataType.STRING(120), allowNull: false })
    declare state_name: string;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
