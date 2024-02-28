import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class SelectService {
    getFaculties = async res => res.json(await prisma.faculty.findMany());

    getPulpits = async res => res.json(await prisma.pulpit.findMany());

    getSubjects = async res => res.json(await prisma.subject.findMany());

    getTeachers = async res => res.json(await prisma.teacher.findMany());

    getAuditoriumsTypes = async res => res.json(await prisma.auditorium_type.findMany());

    getAuditoriums = async res => res.json(await prisma.auditorium.findMany());

    getFacultySubjects = async (res, xyz) => {
        try {
            xyz = parseInt(xyz);
            const facultyToFind = await prisma.faculty.findUnique({ where: { fac_id: xyz } });
            if (!facultyToFind)
                this.sendCustomError(res, 404, `Cannot find faculty = ${xyz}`);
            else {
                res.json(await prisma.faculty.findMany({
                    
                    where: { fac_id: xyz },
                    select: {
                        faculty_abbr: true,
                        pulpit: {
                        select: {
                            pulpit: true,
                            subject: { select: { subject_name: true } }
                        }
                    }
                    }
                }));
            }
        }
        catch (err) { this.sendError(res, err); }
    }


    getTypesAuditoriums = async (res, xyz) => {
        try {
            xyz = parseInt(xyz);
            const typeToFind = await prisma.auditorium_type.findUnique({ where: { auditorium_type_id: xyz } });
            if (!typeToFind)
                this.sendCustomError(res, 404, `Cannot find auditorium_type = ${xyz}`);
            else {
                res.json(await prisma.auditorium_type.findMany({
                    where: { auditorium_type_id: xyz },
                    select: {
                        auditorium_type: true,
                        auditorium: { select: { auditorium: true } }
                    }
                }));
            }
        }
        catch (err) { this.sendError(res, err); }
    }


    getComputerAuditoriums1k = async res => {
        try {
            const auditoriums = await prisma.auditorium.findMany({
                select: { auditorium: true },
                where: {
                    auditoriumTypeRel: {
                        auditorium_type: 'ЛК',
                    },
                    auditorium: {
                        endsWith: '-1'
                    }
                }
            });
    
            res.json(auditoriums);
        } catch (err) {
            this.sendError(res, err);
        }
    }
    


    getPuplitsWithoutTeachers = async res => {
        try {
            const pulpitsWithoutTeachers = await prisma.pulpit.findMany({
                where: {
                    teacher: { none: {} }
                }
            });
            if (pulpitsWithoutTeachers.length === 0)
                this.sendCustomError(res, 404, 'There are no pulpits without teachers');
            else
                res.json(pulpitsWithoutTeachers);
        }
        catch (err) { this.sendError(res, err); }
    }


    getPulpitsWithVladimir = async res => {
        try {
            const pulpitsWithVladimir = await prisma.pulpit.findMany({
                where: {
                    teacher: {
                        some: {
                            teacher_name: {
                                contains: ' Владимир '
                            }
                        }
                    }
                },
                select: {
                    pulpit: true,
                    pulpit_name: true,
                    teacher: {
                        where: {
                            teacher_name: {
                                contains: ' Владимир '
                            }
                        },
                        select: {
                            teacher_name: true,
                        }
                    }
                }
            });
            if (pulpitsWithVladimir.length === 0)
                this.sendCustomError(res, 404, 'There are no pulpits with teachers named "Vladimir"');
            else
                res.json(pulpitsWithVladimir);
        }
        catch (err) { this.sendError(res, err); }
    }

    getPulpitsByCount = async (res, code) => {
        try {
            const result = await prisma.pulpit.findMany({
                select: {
                    pulpit: true,
                    pulpit_name: true,
                    facultyRel: {
                        select: { faculty_abbr: true }
                    },
                    _count: {
                        select: { teacher: true }
                    }
                },
                skip: code * 10,
                take: 10,
            });
            res.json(result);
        } catch (err) { this.sendError(res, err); }
    }

    getAuditoriumsWithSameTypeAndCapacity = async res => {
        try {
            const sameAuditoriums = await prisma.auditorium.groupBy({
                by: ['auditorium_capacity', 'auditorium_type'],
                _count: { auditorium: true },
                having: {
                    auditorium: {
                        _count: { gt: 1 }
                    }
                }
            });
            if (sameAuditoriums.length === 0)
                this.sendCustomError(res, 404, 'There are no auditoriums with same type and capacity');
            else
                res.json(sameAuditoriums);
        }
        catch (err) { this.sendError(res, err); }
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