import Admin from "../models/Admin";

const findByEmail = async (email: string) => {
    return Admin.findOne({ where: { email } });
};

const findById = async (id: number) => {
    return Admin.findByPk(id);
};

const findAnyAdmin = async () => {
    return Admin.findOne({ order: [["id", "ASC"]] });
};

const countAdmins = async () => {
    return Admin.count();
};

const createAdmin = async (payload: { email: string; password_hash: string; name?: string | null }) => {
    return Admin.create({
        email: payload.email,
        password_hash: payload.password_hash,
        name: payload.name || null,
        created_at: new Date(),
    });
};

const deleteByEmail = async (email: string) => {
    return Admin.destroy({ where: { email } });
};

export default { findByEmail, findById, findAnyAdmin, countAdmins, createAdmin, deleteByEmail };
