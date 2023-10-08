const { model, Schema } = require("mongoose");

const vcStatsVCSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  userCountChannel: { type: String },
  memberCountChannel: { type: String },
  botCountChannel: { type: String },
  roleCountChannel: { type: String },
  channelCountChannel: { type: String },
});

module.exports = model("VCStatsVC", vcStatsVCSchema);
