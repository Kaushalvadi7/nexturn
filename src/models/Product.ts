import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import Category from "./Category";

@Table({ tableName: "products", timestamps: false })
export default class Product extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    declare category_id: number | null;

    @BelongsTo(() => Category)
    declare category?: Category;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column(DataType.TEXT)
    declare description: string | null;

    @Default([])
    @Column(DataType.JSONB)
    declare applications: unknown;

    @Default({})
    @Column(DataType.JSONB)
    declare specifications: unknown;


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
}
