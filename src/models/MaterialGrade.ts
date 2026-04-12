import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "material_grades", timestamps: false })
export default class MaterialGrade extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare entity_type: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare entity_id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare grade: string;

    @Column(DataType.STRING(100))
    declare standard: string | null;

    @Column(DataType.STRING(500))
    declare notes: string | null;

    @Default(0)
    @Column(DataType.INTEGER)
    declare sort_order: number;
}
