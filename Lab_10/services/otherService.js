import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class QueryBuilder {
    constructor() {
        this.query = {};
    }

    from(table) {
        this.query.table = table;
        return this;
    }

    where(field, value) {
        if (!this.query.where) {
            this.query.where = [];
        }
        this.query.where.push({ field, value });
        return this;
    }

    async execute() {
        return this.query;
    }
}


export default class OtherService {
    transaction = async (res) => {
        const originalData = await prisma.auditorium.findMany({
            select: { auditorium_id: true, auditorium_capacity: true }
        });
        console.log("Исходные данные:", originalData);
        try {
            await prisma.$transaction(async prisma => {
                await prisma.auditorium.updateMany({
                    data: { auditorium_capacity: { increment: 100 } }
                });
                const tranData = await prisma.auditorium.findMany({
                    select: { auditorium_id: true, auditorium_capacity: true }
                });
                
                console.log("Измененные данные:", tranData);
                throw new Error('Transaction rollback');
            });
        } catch (err) {
            console.log(`${err}`);
            const dataAfterRollback = await prisma.auditorium.findMany({
            select: { auditorium_id: true, auditorium_capacity: true }
        });
            console.log("Данные после отката:", dataAfterRollback);
            res.json("DONE");
        }
    }
    

    getPulpitsByFacultyFluent = async (res) => {
        const queryBuilder = new QueryBuilder();
        queryBuilder.from('users').where('name', 'John').where('age', 20).execute().then(console.log);
        res.json(queryBuilder);
    }

    sendError = async (res, err) => {
        if (err)
            res.status(409).json({
                name: err?.name,
                code: err.code,
                detail: err.original?.detail,
                message: err.message
            });
        else
            this.sendCustomError(res, 409, err);
    }

    sendCustomError = async (res, code, message) => {
        res.status(code).json({ code, message });
    }
}