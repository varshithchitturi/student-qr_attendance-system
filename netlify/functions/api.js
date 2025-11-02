const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const authRoutes = require('../../backend/routes/auth');
const studentRoutes = require('../../backend/routes/students');
const attendanceRoutes = require('../../backend/routes/attendance');

const app = express();

app.use(cors());
app.use(express.json());

// Demo data
global.users = [
  { _id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { _id: '2', username: 'faculty', password: 'faculty123', role: 'faculty' },
  { _id: '3', username: 'student', password: 'student123', role: 'student', studentId: '1' }
];

global.students = [
  { _id: '1', name: 'John Doe', rollNo: 'CS2021001', email: 'john@college.edu', department: 'Computer Science' }
];

global.attendance = [];

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

module.exports.handler = serverless(app);