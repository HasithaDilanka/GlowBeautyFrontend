import Student from "../models/student.js";                               //import karanna ona model eka


export function getStudents(req, res) {                           //databse ekn data ganna ona nam meka use karanna oni

    Student.find().then(
        (students) => {
            res.json(students)                                            //students kiyana variable ekata gaththama data eka res ekata yanna one
            {
                console.log("Students fetched");
            }
        }

    ).catch(
        () => {
            res.json(
                {
                    message: "Failed to fetch students",
                }
            );
        }
    )
};


export function postStudent(req, res) {                                 //database ekata data ekak yanna ona nam meka use karanna oni

    if (req.user == null) {                 //user ekak login una nathnam meka run wenna one    
        res.status(403)
        return res.json({
            message: "plese login to create a student"
        });
        return
    }
    if (req.user.role !== "admin") {                        //user ekata role eka check karanna ona
        res.status(403)
        return res.json({      
            message: "plese login as an admin to create a student"
        });
    }


    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });

    student.save().then(
        () => {
            res.json(
                {
                    message: "Student saved",
                }

            );
            console.log(req.body)
        }
    ).catch(
        () => {
            res.json(
                {
                    message: "Failed to save student",
                }
            );
        }
    );

};



export function deleteStudent(req, res) {                           //database ekata data ekk delete karanna ona nam meka use karanna oni

    const studentId = req.body.id;                                  //delete karanna ona data ekata id eka ganna one

    Student.findByIdAndDelete(studentId).then(
        () => {
            res.json(
                {
                    message: "Student deleted",
                }
            );
        }
    ).catch(
        () => {
            res.json(
                {
                    message: "Failed to delete student",
                }
            );
        }
    );
}



export function putStudent(req, res) {                          //app ekata put req ekk avoth meka run karanna

    const studentId = req.body.id;                              //put karanna ona data ekata id eka ganna one

    const student = {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    };

    Student.findByIdAndUpdate(studentId, student).then(
        () => {
            res.json(
                {
                    message: "Student updated",
                }
            );
        }
    ).catch(
        () => {
            res.json(
                {
                    message: "Failed to update student",
                }
            );
        }
    );
}