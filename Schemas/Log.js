const {model, Schema} = require('mongoose');

let logSchema = new Schema({
  GuildId: String,
  ChannelId: String,
});

module.exports = model('Logs', logSchema);