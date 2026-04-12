import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "client_problem_solving", timestamps: false })
export default class ClientProblemSolving extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare client_name: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare product_name: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare client_location: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare year: number;

    @Column(DataType.TEXT)
    declare challange: string | null;

    @Column(DataType.TEXT)
    declare solution: string | null;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
    declare results: string[];

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}

