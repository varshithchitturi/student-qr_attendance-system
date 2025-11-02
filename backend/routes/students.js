const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/generate-qr/:id', auth, async (req, res) => {
  try {
    const student = global.students.find(s => s._id === req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const qrData = {
      studentId: student._id,
      rollNo: student.rollNo,
      timestamp: Date.now(),
      uuid: uuidv4()
    };

    const qrString = JSON.stringify(qrData);
    const qrCodeUrl = await QRCode.toDataURL(qrString);

    res.json({ qrCode: qrCodeUrl, qrData: qrString });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', auth, authorize(['admin']), async (req, res) => {
  try {
    res.json(global.students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', auth, authorize(['student']), async (req, res) => {
  try {
    const student = global.students.find(s => s._id === req.user.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;