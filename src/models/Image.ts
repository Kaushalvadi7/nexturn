import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "images", timestamps: false })
export default class Image extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare entity_type: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare entity_id: number;

    @Column({ type: DataType.STRING(500), allowNull: false })
    declare image_url: string;

    @Column(DataType.STRING(255))
    declare public_id: string | null;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare is_primary: boolean;

    @Default(0)
    @Column(DataType.INTEGER)
    declare sort_order: number;
}
