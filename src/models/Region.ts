import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "regions", timestamps: false })
export default class Region extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare country: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare state: string;

    @Column(DataType.BOOLEAN)
    declare is_active: boolean | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
