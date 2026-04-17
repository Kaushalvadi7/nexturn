import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "company_profile_downloads", timestamps: false })
export default class CompanyProfileDownload extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column({ type: DataType.STRING(255), allowNull: false, validate: { isEmail: true } })
    declare email: string;

    @Column(DataType.DATE)
    declare created_at: Date;
}
