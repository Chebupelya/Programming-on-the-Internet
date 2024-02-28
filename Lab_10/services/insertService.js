import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class InsertService {
    insertFaculty = async (res, dto) => {
        try {
            const { faculty_abbr, faculty_name, pulpit } = dto;
            const facultyExists = await prisma.faculty.findFirst({ where: { faculty_abbr } });
    
            if (facultyExists) {
                this.sendCustomError(res, 409, `There is already a faculty with abbreviation = ${faculty_abbr}`);
            } else {
                const createdFaculty = await prisma.faculty.create({
                    data: {
                        faculty_abbr,
                        faculty_name,
                        pulpit: Array.isArray(pulpit) ? {
                            create: pulpit.map(pulpitData => ({
                                pulpit: pulpitData.pulpit,
                                pulpit_name: pulpitData.pulpit_name
                            }))
                        } : undefined
                    },
                    include: {
                        pulpit: true
                    }
                });
    
                console.log("Faculty and its pulpits (if provided) were created successfully.");
                res.status(201).json(createdFaculty);
            }
        } catch (err) {
            console.error("Error creating faculty:", err);
            this.sendError(res, err);
        }
    };



    insertPulpit = async (res, dto) => {
        try {
            const { pulpit, pulpit_name, faculty_abbr, faculty_name } = dto;
            // Проверка на существование кафедры
            const pulpitExists = await prisma.pulpit.findFirst({ where: { pulpit } });
    
            if (pulpitExists) {
                this.sendCustomError(res, 409, `There is already a pulpit with the code = ${pulpit}`);
            } else {
                const faculty = await prisma.faculty.findFirst({
                    where: { faculty_abbr }
                });
    
                let facultyId;
                if (!faculty) {
                    const newFaculty = await prisma.faculty.create({
                        data: {
                            faculty_abbr,
                            faculty_name
                        }
                    });
                    facultyId = newFaculty.fac_id;
                } else {
                    facultyId = faculty.fac_id;
                }
    
                const newPulpit = await prisma.pulpit.create({
                    data: {
                        pulpit,
                        pulpit_name,
                        faculty: facultyId
                    },
                    select: {
                        pulpit: true,
                        pulpit_name: true,
                        facultyRel: {
                            select: {
                                fac_id: true,
                                faculty_abbr: true,
                                faculty_name: true
                            }
                        }
                    }
                });
                res.status(201).json(newPulpit);
            }
        } catch (err) {
            console.error("Error creating pulpit:", err);
            this.sendError(res, err);
        }
    };
    
    


    insertSubject = async (res, dto) => {
        try {
            const { subject, subject_name, pulpit } = dto;
            const subjectExists = await prisma.subject.findFirst({ where: { subject } });
            const pulpitExists = await prisma.pulpit.findFirst({ where: { pulpit_id: pulpit } });
    
            if (subjectExists)
                this.sendCustomError(res, 409, `There is already subject = ${subject}`);
            else if (!pulpitExists)
                this.sendCustomError(res, 404, `Cannot find pulpit with ID = ${pulpit}`);
            else
                res.status(201).json(await prisma.subject.create({
                    data: {
                        subject,
                        subject_name,
                        pulpitRel: {
                            connect: { pulpit_id: pulpit }
                        }
                    }
                }));
        }
        catch (err) { console.log(err); this.sendError(res, err); }
    }
    


    insertTeacher = async (res, dto) => {
        try {
            const { teacher, teacher_name, pulpit } = dto;
            const teacherExists = await prisma.teacher.findFirst({ where: { teacher } });
            const pulpitExists = await prisma.pulpit.findFirst({ where: { pulpit_id: pulpit } });
    
            if (teacherExists)
                this.sendCustomError(res, 409, `There is already teacher = ${teacher}`);
            else if (!pulpitExists)
                this.sendCustomError(res, 404, `Cannot find pulpit with ID = ${pulpit}`);
            else
                res.status(201).json(await prisma.teacher.create({
                    data: {
                        teacher,
                        teacher_name,
                        pulpitRel: {
                            connect: { pulpit_id: pulpit }
                        }
                    }
                }));
        }
        catch (err) { this.sendError(res, err); }
    }
    


    insertAuditoriumType = async(res, dto) => {
        try {
            const { auditorium_type, auditorium_typename } = dto;
            const typeExists = await prisma.auditorium_type.findFirst({ where: { auditorium_type } });
            if (typeExists) {
                this.sendCustomError(res, 409, `There is already auditorium_type = ${auditorium_type}`);
            } else {
                res.status(201).json(await prisma.auditorium_type.create({
                    data: {
                        auditorium_type,
                        auditorium_typename
                    }
                }));
            }
        } catch (err) {
            this.sendError(res, err);
        }
    }

    


    insertAuditorium = async (res, dto) => {
        try {
            const { auditorium, auditorium_name, auditorium_capacity, auditorium_type } = dto;
            const auditoriumExists = await prisma.auditorium.findFirst({ where: { auditorium } });
            const typeExists = await prisma.auditorium_type.findFirst({ where: { auditorium_type_id: auditorium_type } });
    
            if (auditoriumExists)
                this.sendCustomError(res, 409, `There is already auditorium = ${auditorium}`);
            else if (!typeExists)
                this.sendCustomError(res, 404, `Cannot find auditorium_type = ${auditorium_type}`);
            else
                res.status(201).json(await prisma.auditorium.create({
                    data: {
                        auditorium,
                        auditorium_name,
                        auditorium_capacity,
                        auditoriumTypeRel: {
                            connect: { auditorium_type_id: auditorium_type }
                        }
                    }
                }));
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