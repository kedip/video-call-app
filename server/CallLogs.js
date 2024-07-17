const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
  callStart: { type: Date, required: true },
  callEnd: { type: Date, required: true },
  participants: [String], // array of socket IDs or user IDs
});

module.exports = mongoose.model("CallLog", callLogSchema);
