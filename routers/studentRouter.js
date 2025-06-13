import express from 'express';
import { getStudents, deleteStudent, postStudent, putStudent } from '../controllers/studentController.js';


const studentRouter = express.Router();


studentRouter.get("/", getStudents);

studentRouter.post("/", postStudent);

studentRouter.delete("/", deleteStudent);

studentRouter.put("/", putStudent)


export default studentRouter;                                   //studentRouter kiyana variable eka export karanna ona