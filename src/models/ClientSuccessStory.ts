import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "client_success_stories", timestamps: false })
export default class ClientSuccessStory extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.INTEGER)
    declare stars: number | null;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare client_name: string;

    @Column(DataType.STRING)
    declare client_position: string | null;

    @Column(DataType.STRING)
    declare client_city: string | null;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Column(DataType.STRING)
    declare client_purchase: string | null;

    @Column(DataType.BOOLEAN)
    declare is_active: boolean | null;

    @Column(DataType.INTEGER)
    declare sort_order: number | null;

    @Column(DataType.DATE)
    declare created_at: Date | null;

    @Column(DataType.DATE)
    declare updated_at: Date | null;
}
