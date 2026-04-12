import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "material_specialization", timestamps: false })
export default class MaterialSpecialization extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.TEXT)
    declare image_url: string | null;

    @Column(DataType.TEXT)
    declare public_url: string | null;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare title: string;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Column(DataType.JSONB)
    declare grades: string[] | null;

    @Column(DataType.JSONB)
    declare common_application: string[] | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
