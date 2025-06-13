import User from "../models/user.js";
import bcrypt from "bcrypt";                                 // Importing bcrypt for password hashing
import jwt from "jsonwebtoken";                           // Importing jsonwebtoken for token generation

export function createUser(req, res) {

    const passwordHash = bcrypt.hashSync(req.body.password, 10); // Hashing the password 

    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,

    }

    const user = new User(userData);
    user.save().then(
        () => {
            res.json(
                {
                    message: "User created successfully",
                }
            );
        }
    ).catch(
        () => {
            res.json(
                {
                    message: "Failed to create user",
                }
            );
        }
    );
}

// Function to handle user login

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    }).then(
        (user) => {
            if (user == null) {
                res.status(400).json(
                    {
                        message: "User not found",
                    }
                );
            } else {
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);   // Comparing the hashed password
                if (isPasswordCorrect) {

                    const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isBlocked: user.isBlocked,
                            isEmailVerified: user.isEmailVerified,
                            image: user.image,

                        },
                        "hasitha", // Replace with your secret key
                    );

                    res.json({
                        message: "Login successful",
                        token: token
                    });
                } else {
                    res.status(403).json({
                        message: "Invalid password",
                    });
                }

            }
        }
    ).catch(
        (error) => {
            res.status(500).json({ message: "Error logging in", error });
        }
    );

}
