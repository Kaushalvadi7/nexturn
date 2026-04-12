import { AutoIncrement, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Product from "./Product";

@Table({ tableName: "categories", timestamps: false })
export default class Category extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Column(DataType.TEXT)
    declare process: string | null;

    @Column(DataType.TEXT)
    declare surface_finish: string | null;

    @Default([])
    @Column(DataType.JSONB)
    declare applications: unknown;

    @Default(true)
    @Column(DataType.BOOLEAN)
    declare is_active: boolean;

    @Default(0)
    @Column(DataType.INTEGER)
    declare sort_order: number;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare created_at: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare updated_at: Date;

    @HasMany(() => Product)
    declare products?: Product[];
}
