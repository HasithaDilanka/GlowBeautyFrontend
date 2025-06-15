import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routers/userRouter.js';
import jwt from "jsonwebtoken";
import productRouter from './routers/productRouter.js';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file



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
                process.env.JWT_SERET, // Use the secret from environment variables
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


let connectionString = process.env.MONGO_URI;

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

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});