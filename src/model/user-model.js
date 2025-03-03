import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    Username  : {
        required : true,
        type : String
    },
    email : {
        required : true,
        type : String,
        unique : true
    },
    password : {
        required : true,
        type : String,
    }
});

export const User = mongoose.models.User ?? mongoose.model("User", userSchema)