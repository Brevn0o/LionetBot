const {model, Schema} = require("mongoose");

let schema = new Schema({
    Guild: String,
});

module.exports = model("remind", schema);
