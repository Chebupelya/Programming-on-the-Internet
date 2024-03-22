import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class UpdateService {
    updateFaculty = async (res, dto) => {
        try {
            const { fac_id, faculty_name, faculty_abbr } = dto;
            const facultyToUpdate = await prisma.faculty.findUnique({ where: { fac_id } });
            if (!facultyToUpdate) {
                this.sendCustomError(res, 404, `Cannot find faculty with ID = ${fac_id}`);
            } else {
                const updateData = {};
                if (faculty_name !== undefined) {
                    updateData.faculty_name = faculty_name;
                }
                if (faculty_abbr !== undefined) {
                    updateData.faculty_abbr = faculty_abbr;
                }
    
                await prisma.faculty.update({
                    where: { fac_id },
                    data: updateData,
                }).then(async () => res.json(await prisma.faculty.findUnique({ where: { fac_id } })));
            }
        } catch (err) {
            this.sendError(res, err);
        }
    };
    


    updatePulpit = async (res, dto) => {
        try {
            const { pulpit_id, pulpit, pulpit_name, faculty_id } = dto;
    
            const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit_id } });
            if (!pulpitToUpdate) {
                this.sendCustomError(res, 404, `Cannot find pulpit with ID = ${pulpit_id}`);
                return;
            }
    
            if (faculty_id !== undefined) {
                const facultyToUpdate = await prisma.faculty.findUnique({ where: { fac_id: faculty_id } });
                if (!facultyToUpdate) {
                    this.sendCustomError(res, 404, `Cannot find faculty with ID = ${faculty_id}`);
                    return;
                }
            }
    
            const updateData = {};
            if (pulpit !== undefined) updateData.pulpit = pulpit;
            if (pulpit_name !== undefined) updateData.pulpit_name = pulpit_name;
            if (faculty_id !== undefined) updateData.faculty = faculty_id;
    
            await prisma.pulpit.update({
                where: { pulpit_id },
                data: updateData,
            }).then(async () => {
                res.json(await prisma.pulpit.findUnique({
                    where: { pulpit_id },
                    include: { facultyRel: true }
                }));
            });
        } catch (err) {
            this.sendError(res, err);
        }
    };
    
    


    updateSubject = async (res, dto) => {
        try {
            const { subject_id, subject, subject_name, pulpit_id } = dto;
    
            const subjectToUpdate = await prisma.subject.findUnique({ where: { subject_id } });
            if (!subjectToUpdate) {
                this.sendCustomError(res, 404, `Cannot find subject with ID = ${subject_id}`);
                return;
            }
    
            if (pulpit_id !== undefined) {
                const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit_id } });
                if (!pulpitToUpdate) {
                    this.sendCustomError(res, 404, `Cannot find pulpit with ID = ${pulpit_id}`);
                    return;
                }
            }
    
            const updateData = {};
            if (subject !== undefined) updateData.subject = subject;
            if (subject_name !== undefined) updateData.subject_name = subject_name;
            if (pulpit_id !== undefined) updateData.pulpit = pulpit_id;
    
            await prisma.subject.update({
                where: { subject_id },
                data: updateData,
            }).then(async () => {
                res.json(await prisma.subject.findUnique({
                    where: { subject_id },
                    include: { pulpitRel: true }
                }));
            });
        } catch (err) {
            this.sendError(res, err);
        }
    }


    updateTeacher = async (res, dto) => {
        try {
            const { teacher_id, teacher, teacher_name, pulpit_id } = dto;
    
            const teacherToUpdate = await prisma.teacher.findUnique({ where: { teacher_id } });
            if (!teacherToUpdate) {
                this.sendCustomError(res, 404, `Cannot find teacher with ID = ${teacher_id}`);
                return;
            }
    
            if (pulpit_id !== undefined) {
                const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit_id } });
                if (!pulpitToUpdate) {
                    this.sendCustomError(res, 404, `Cannot find pulpit with ID = ${pulpit_id}`);
                    return;
                }
            }
    
            const updateData = {};
            if (teacher !== undefined) updateData.teacher = teacher;
            if (teacher_name !== undefined) updateData.teacher_name = teacher_name;
            if (pulpit_id !== undefined) updateData.pulpit = pulpit_id;
    
            await prisma.teacher.update({
                where: { teacher_id },
                data: updateData,
            }).then(async () => {
                res.json(await prisma.teacher.findUnique({
                    where: { teacher_id },
                    include: { pulpitRel: true }
                }));
            });
        } catch (err) {
            this.sendError(res, err);
        }
    }


    updateAuditoriumType = async (res, dto) => {
        try {
            const { auditorium_type_id, auditorium_type, auditorium_typename } = dto;
    
            const audTypeToUpdate = await prisma.auditorium_type.findUnique({ where: { auditorium_type_id } });
            if (!audTypeToUpdate) {
                this.sendCustomError(res, 404, `Cannot find auditorium type with ID = ${auditorium_type_id}`);
                return;
            }
    
            const updateData = {};
            if (auditorium_type !== undefined) updateData.auditorium_type = auditorium_type;
            if (auditorium_typename !== undefined) updateData.auditorium_typename = auditorium_typename;

            await prisma.auditorium_type.update({
                where: { auditorium_type_id },
                data: updateData,
            }).then(async () => {
                res.json(await prisma.auditorium_type.findUnique({
                    where: { auditorium_type_id }
                }));
            });
        } catch (err) {
            this.sendError(res, err);
        }
    }


    updateAuditorium = async (res, dto) => {
        try {
            const { auditorium_id, auditorium, auditorium_name, auditorium_capacity, auditorium_type } = dto;
    
            const auditoriumToUpdate = await prisma.auditorium.findUnique({ where: { auditorium_id } });
            if (!auditoriumToUpdate) {
                this.sendCustomError(res, 404, `Cannot find auditorium with ID = ${auditorium_id}`);
                return;
            }
            if (auditorium_type !== undefined) {
                const auditoriumTypeToUpdate = await prisma.auditorium_type.findUnique({ where: {auditorium_type_id: auditorium_type} });
                if (!auditoriumTypeToUpdate) {
                    this.sendCustomError(res, 404, `Cannot find auditorium type with ID = ${auditorium_type}`);
                    return;
                }
            }
    
            const updateData = {};
            if (auditorium !== undefined) updateData.auditorium = auditorium;
            if (auditorium_name !== undefined) updateData.auditorium_name = auditorium_name;
            if (auditorium_capacity !== undefined) updateData.auditorium_capacity = auditorium_capacity;
            if (auditorium_type !== undefined) updateData.auditorium_type = auditorium_type;
    
            await prisma.auditorium.update({
                where: { auditorium_id },
                data: updateData,
            }).then(async () => {
                res.json(await prisma.auditorium.findUnique({
                    where: { auditorium_id },
                    include: { auditoriumTypeRel: true }
                }));
            });
        } catch (err) {
            this.sendError(res, err);
        }
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