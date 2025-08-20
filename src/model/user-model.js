import mongoose, { Schema } from "mongoose";

const mcqSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: String, required: true },
    topic: { type: String, required: true },
});

const quizSchema = new Schema({
    skills: [{ type: String, required: true }],
    difficulty: { type: String, required: true },
    questions: [mcqSchema],
    topic_counts: { type: Object },
    score: { type: Number, default: 0 },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

const achievementSchema = new Schema({
    quizName: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

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
        type : String,
    },
    image: {
        type: String,
    },
    quizzes: {
        type: [quizSchema],
        default: []
    },
    achievements: {
        type: [achievementSchema],
        default: []
    },
    learningPath: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

delete mongoose.models.User;

export const User = mongoose.models.User ?? mongoose.model("User", userSchema)