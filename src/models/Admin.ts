import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table({ tableName: "admins", timestamps: false })
export default class Admin extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(255))
    declare email: string;

    @AllowNull(false)
    @Column(DataType.STRING(500))
    declare password_hash: string;

    @Column(DataType.STRING(255))
    declare name: string | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;
}
