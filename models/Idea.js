const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rewardsEarned: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        required: false
    }
});

module.exports = Idea = mongoose.model("ideas", IdeaSchema);
