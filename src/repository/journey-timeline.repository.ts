import { Transaction } from "sequelize";
import JourneyTimeline from "../models/JourneyTimeline";

type CreateJourneyTimelineInput = {
    year: number;
    title: string;
    description: string;
};

const bulkCreateJourneyTimeline = async (
    data: CreateJourneyTimelineInput[],
    transaction: Transaction,
) => {
    if (data.length === 0) {
        return [];
    }
    return JourneyTimeline.bulkCreate(data, { transaction });
};

const deleteAllJourneyTimeline = async (transaction: Transaction) => {
    return JourneyTimeline.destroy({ where: {}, transaction });
};

const findAllJourneyTimeline = async () => {
    return JourneyTimeline.findAll({ order: [["year", "ASC"], ["id", "ASC"]] });
};

export default { bulkCreateJourneyTimeline, deleteAllJourneyTimeline, findAllJourneyTimeline };
