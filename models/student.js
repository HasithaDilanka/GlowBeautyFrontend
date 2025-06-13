import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({                  // studentSchema kiyanne database ekata ganna ona data type eka
                                                             //schema kiyanne database ekata ganna ona data type eka
    name: String,
    age: Number,
    email: String
});

const Student = mongoose.model("students", studentSchema);

export default Student;