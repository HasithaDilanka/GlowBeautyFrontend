import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routers/userRouter.js';
import studentRouter from './routers/studentRouter.js';
import jwt from "jsonwebtoken";


const app = express();

app.use(bodyParser.json());


//user token middleware 

app.use(
    (req, res, next) => {
        const value = req.header("Authorization");

        if (value != null) {

            const token = value.replace("Bearer ", "")
            jwt.verify(
                token,
                "hasitha",
                (err, decoded) => {
                    console.log(decoded);
                    if (decoded == null) {
                        res.status(403).json({
                            message: "Unautherized"
                        });
                    } else {

                        req.user = decoded
                        next();
                    }
                }
            )

        } else {
            next();       // This function allows the request to continue to the next middleware or route handler
        }


    }
)


//db connection


let connectionString = "mongodb+srv://admin:123@cluster0.uk6zfdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  //mongodb ekata connect wenna ona connection string eka

mongoose.connect(connectionString).then(
    () => {
        console.log("Database connected");
    }
).catch(
    () => {
        console.log("Failed to connect to Database");
    }
);



//routes

app.use("/users", userRouter);
app.use("/student", studentRouter);


app.listen(3000, () => {
    console.log("Server started on port 3000");
});