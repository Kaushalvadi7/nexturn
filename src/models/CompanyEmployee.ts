import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "company_employees", timestamps: false })
export default class CompanyEmployee extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare role: string;

    @Column(DataType.TEXT)
    declare education: string | null;

    @Column(DataType.TEXT)
    declare experience: string | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}

