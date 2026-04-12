import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "manufacturing_facality", timestamps: false })
export default class ManufacturingFacality extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare title: string;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}

