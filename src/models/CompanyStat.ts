import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table({ tableName: "company_stats", timestamps: false })
export default class CompanyStat extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(100))
    declare key: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare value: string;

    @Column(DataType.STRING(255))
    declare label: string | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
