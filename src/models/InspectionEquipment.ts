import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "inspection_equipment", timestamps: false })
export default class InspectionEquipment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare title: string;

    @Column(DataType.STRING(255))
    declare icon_name: string | null;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare measurement: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare accuracy: string;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
    declare application: string[];

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
