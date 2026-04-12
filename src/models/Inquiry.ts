import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "inquiries", timestamps: false })
export default class Inquiry extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare full_name: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare email: string;

    @Column(DataType.STRING(50))
    declare phone: string | null;

    @Column(DataType.STRING(255))
    declare company_name: string | null;

    @Column(DataType.STRING)
    declare category_name: string | null;

    @Column(DataType.STRING(500))
    declare subject: string | null;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare message: string;

    @Column(DataType.STRING(50))
    declare status: string | null;

    @Column(DataType.BOOLEAN)
    declare is_viewed: boolean | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;
}
