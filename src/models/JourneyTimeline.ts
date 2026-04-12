import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "journey_timeline", timestamps: false })
export default class JourneyTimeline extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare year: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare description: string;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare created_at: Date;

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare updated_at: Date;
}
