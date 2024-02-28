import express from 'express';
const app = express();

const staticDir = './static';
const prefix = '/api';

import InsertService from './services/insertService.js';
import SelectService from './services/selectService.js';
import UpdateService from './services/updateService.js';
import DeleteService from './services/deleteService.js';
import OtherService from './services/otherService.js';

const insertService = new InsertService();
const selectService = new SelectService();
const updateService = new UpdateService();
const deleteService = new DeleteService();
const otherService = new OtherService();

app.use(express.json());
app.use(express.static('static'))
app.get('/', (req, res) => { res.sendFile(staticDir + 'index.html'); });

 app.get(prefix + '/faculties',                   (req, res) => selectService.getFaculties(res))
    .get(prefix + '/pulpits',                     (req, res) => selectService.getPulpits(res))
    .get(prefix + '/getPulpitsByCount/:code',     (req, res) => selectService.getPulpitsByCount(res,req.params['code']))
    .get(prefix + '/subjects',                    (req, res) => selectService.getSubjects(res))
    .get(prefix + '/teachers',                    (req, res) => selectService.getTeachers(res))
    .get(prefix + '/auditoriumstypes',             (req, res) => selectService.getAuditoriumsTypes(res))
    .get(prefix + '/auditoriums',                 (req, res) => selectService.getAuditoriums(res))
    .get(prefix + '/faculties/:xyz/subjects',     (req, res) => selectService.getFacultySubjects(res, req.params['xyz']))
    .get(prefix + '/auditoriumtypes/:xyz/auditoriums', (req, res) => selectService.getTypesAuditoriums(res, req.params['xyz']))
    .get(prefix + '/auditoriumsWithComp1',        (req, res) => selectService.getComputerAuditoriums1k(res))
    .get(prefix + '/puplitsWithoutTeachers',      (req, res) => selectService.getPuplitsWithoutTeachers(res))
    .get(prefix + '/pulpitsWithVladimir',         (req, res) => selectService.getPulpitsWithVladimir(res))
    .get(prefix + '/auditoriumsSameCount',        (req, res) => selectService.getAuditoriumsWithSameTypeAndCapacity(res))
    .get(prefix + '/transaction',                 (req, res) => otherService.transaction(res))
    .get(prefix + '/fluent',                      (req, res) => otherService.getPulpitsByFacultyFluent(res));
 
 app.post(prefix + '/faculties',                  (req, res) => insertService.insertFaculty(res, req.body))
    .post(prefix + '/pulpits',                    (req, res) => insertService.insertPulpit(res, req.body))
    .post(prefix + '/subjects',                   (req, res) => insertService.insertSubject(res, req.body))
    .post(prefix + '/teachers',                   (req, res) => insertService.insertTeacher(res, req.body))
    .post(prefix + '/auditoriumstypes',           (req, res) => insertService.insertAuditoriumType(res, req.body))
    .post(prefix + '/auditoriums',                (req, res) => insertService.insertAuditorium(res, req.body));

 app.put(prefix + '/faculties',                   (req, res) => updateService.updateFaculty(res, req.body))
    .put(prefix + '/pulpits',                     (req, res) => updateService.updatePulpit(res, req.body))
    .put(prefix + '/subjects',                    (req, res) => updateService.updateSubject(res, req.body))
    .put(prefix + '/teachers',                    (req, res) => updateService.updateTeacher(res, req.body))
    .put(prefix + '/auditoriumstypes',            (req, res) => updateService.updateAuditoriumType(res, req.body))
    .put(prefix + '/auditoriums',                 (req, res) => updateService.updateAuditorium(res, req.body));

 app.delete(prefix + '/faculties/:faculty',       (req, res) => deleteService.deleteFaculty(res, req.params['faculty']))
    .delete(prefix + '/pulpits/:pulpit',          (req, res) => deleteService.deletePulpit(res, req.params['pulpit']))
    .delete(prefix + '/subjects/:subject',        (req, res) => deleteService.deleteSubject(res, req.params['subject']))
    .delete(prefix + '/teachers/:teacher',        (req, res) => deleteService.deleteTeacher(res, req.params['teacher']))
    .delete(prefix + '/auditoriumtypes/:type',    (req, res) => deleteService.deleteAuditoriumType(res, req.params['type']))
    .delete(prefix + '/auditoriums/:auditorium',  (req, res) => deleteService.deleteAuditorium(res, req.params['auditorium']));



app.listen(3000, () => console.log(`Server running at http://localhost:${3000}/\n`));