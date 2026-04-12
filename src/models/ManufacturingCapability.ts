import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "manufacturing_capabilities", timestamps: false })
export default class ManufacturingCapability extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare title: string;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Column(DataType.JSONB)
    declare feature: unknown | null;

    @Column(DataType.STRING(255))
    declare icon_name: string | null;

    @Column(DataType.INTEGER)
    declare sort_order: number | null;

    @Column(DataType.BOOLEAN)
    declare is_active: boolean | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
