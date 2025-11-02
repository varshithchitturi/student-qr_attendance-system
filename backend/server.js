const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');

const app = express();

app.use(cors({
  origin: ['https://student-qr-attendance-system.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Simple in-memory storage for demo (no MongoDB required)
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

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});