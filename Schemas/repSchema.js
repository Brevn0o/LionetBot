const { model, Schema } = require("mongoose");

let reputationSchema = new Schema({
    guildId: { type: String, required: true },
    userId: String,
    reputationPoints: Number,
    lastRepTime: Date,
    superRepReceived: { type: Number, default: 0 }, 
    interactions: [
        {
            targetId: { type: String, required: true },
            cooldownEnd: { type: Number, required: true },
        },
    ],
});


module.exports = model("reputationSchema", reputationSchema);
