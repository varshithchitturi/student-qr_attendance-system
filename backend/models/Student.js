const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  qrCode: { type: String, unique: true },
  qrCodeExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);