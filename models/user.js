import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true, 
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
        default : "NOT GIVEN"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    role: {
        type : String,
        default : "user"
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    },
    image: {
        type : String,
        default : "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
    },
    createdAt: {
        type : Date,
        default : Date.now
    },

})

const User = mongoose.model("users", userSchema);
export default User;