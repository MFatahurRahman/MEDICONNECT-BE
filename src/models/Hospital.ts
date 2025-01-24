const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  departments: [{ name: String }],
});

module.exports = mongoose.model("Hospital", HospitalSchema);
