const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/mark', auth, authorize(['faculty']), async (req, res) => {
  try {
    const { qrData, latitude, longitude } = req.body;
    
    const parsedQR = JSON.parse(qrData);
    const student = global.students.find(s => s._id === parsedQR.studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = {
      _id: Date.now().toString(),
      studentId: student._id,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      location: { latitude, longitude },
      status: 'present'
    };

    global.attendance.push(attendance);
    res.json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all/records', auth, authorize(['admin']), async (req, res) => {
  try {
    const records = global.attendance.map(a => ({
      ...a,
      studentId: global.students.find(s => s._id === a.studentId)
    }));
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/student/my-attendance', auth, authorize(['student']), async (req, res) => {
  try {
    const records = global.attendance.filter(a => a.studentId === req.user.studentId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;