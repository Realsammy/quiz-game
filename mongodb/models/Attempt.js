import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    specId: {
        type: String,
        required: true,
    },
});

const Attempt =
    mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);

export default Attempt;
