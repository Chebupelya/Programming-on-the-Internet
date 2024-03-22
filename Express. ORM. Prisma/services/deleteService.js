
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class DeleteService {
    deleteFaculty = async (res, faculty_id) => {
        try {
            faculty_id = parseInt(faculty_id);
            const facultyToDelete = await prisma.faculty.findUnique({ where: { fac_id: faculty_id } });
            if (!facultyToDelete)
                this.sendCustomError(res, 404, `Cannot find faculty = ${faculty_id}`);
            else
                await prisma.faculty.delete({ where: { fac_id: faculty_id } })
                    .then(() => res.json(facultyToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    


    deletePulpit = async (res, pulpit_id) => {
        try {
            pulpit_id = parseInt(pulpit_id);
            const pulpitToDelete = await prisma.pulpit.findUnique({ where: { pulpit_id: pulpit_id } });
            if (!pulpitToDelete)
                this.sendCustomError(res, 404, `Cannot find pulpit = ${pulpit_id}`);
            else
                await prisma.pulpit.delete({ where: { pulpit_id: pulpit_id } })
                    .then(() => res.json(pulpitToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    


    deleteSubject = async (res, subject_id) => {
        try {
            subject_id = parseInt(subject_id);
            const subjectToDelete = await prisma.subject.findUnique({ where: { subject_id: subject_id } });
            if (!subjectToDelete)
                this.sendCustomError(res, 404, `Cannot find subject = ${subject_id}`);
            else
                await prisma.subject.delete({ where: { subject_id: subject_id } })
                    .then(() => res.json(subjectToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    


    deleteTeacher = async (res, teacher_id) => {
        try {
            teacher_id = parseInt(teacher_id);
            const teacherToDelete = await prisma.teacher.findUnique({ where: { teacher_id: teacher_id } });
            if (!teacherToDelete)
                this.sendCustomError(res, 404, `Cannot find teacher = ${teacher_id}`);
            else
                await prisma.teacher.delete({ where: { teacher_id: teacher_id } })
                    .then(() => res.json(teacherToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    


    deleteAuditoriumType = async (res, auditorium_type_id) => {
        try {
            auditorium_type_id = parseInt(auditorium_type_id);
            const typeToDelete = await prisma.auditorium_type.findUnique({
                where: { auditorium_type_id: auditorium_type_id }
            });
            if (!typeToDelete)
                this.sendCustomError(res, 404, `Cannot find auditorium_type = ${auditorium_type_id}`);
            else
                await prisma.auditorium_type.delete({ where: { auditorium_type_id: auditorium_type_id } })
                    .then(() => res.json(typeToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    


    deleteAuditorium = async (res, auditorium_id) => {
        try {
            auditorium_id = parseInt(auditorium_id);
            const auditoriumToDelete = await prisma.auditorium.findUnique({
                where: { auditorium_id: auditorium_id }
            });
            if (!auditoriumToDelete)
                this.sendCustomError(res, 404, `Cannot find auditorium = ${auditorium_id}`);
            else
                await prisma.auditorium.delete({ where: { auditorium_id: auditorium_id } })
                    .then(() => res.json(auditoriumToDelete));
        }
        catch (err) { this.sendError(res, err); }
    };
    

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