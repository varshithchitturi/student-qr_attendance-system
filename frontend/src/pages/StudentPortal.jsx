import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QrCode, Calendar, Download, RefreshCw } from 'lucide-react';

const StudentPortal = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentProfile();
    fetchAttendance();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await axios.get('/api/students/profile');
      setStudent(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('/api/attendance/student/my-attendance');
      setAttendance(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    }
  };

  const generateQRCode = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/students/generate-qr/${student._id}`);
      setQrCode(response.data.qrCode);
      toast.success('QR code generated successfully!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-code-${student?.rollNo}.png`;
    link.click();
  };

  const attendancePercentage = attendance.length > 0 
    ? Math.round((attendance.length / 30) * 100) // Assuming 30 total classes
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
        <p className="text-gray-600">View your QR code and attendance history</p>
      </motion.div>

      {/* Student Profile */}
      {student && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {student.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">Roll No: {student.rollNo}</p>
              <p className="text-gray-600">Department: {student.department}</p>
              <p className="text-gray-600">Email: {student.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Code</h3>
          
          <div className="text-center space-y-4">
            {qrCode ? (
              <div>
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  QR code expires in 24 hours
                </p>
                <button
                  onClick={downloadQRCode}
                  className="btn-secondary flex items-center space-x-2 mx-auto mt-3"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ) : (
              <div className="py-8">
                <QrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Generate your QR code for attendance</p>
              </div>
            )}
            
            <button
              onClick={generateQRCode}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{qrCode ? 'Regenerate QR Code' : 'Generate QR Code'}</span>
            </button>
          </div>
        </motion.div>

        {/* Attendance Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Statistics</h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {attendancePercentage}%
              </div>
              <p className="text-gray-600">Overall Attendance</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {attendance.length}
                </div>
                <p className="text-sm text-green-700">Classes Attended</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {30 - attendance.length}
                </div>
                <p className="text-sm text-red-700">Classes Missed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mt-8"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {attendance.length > 0 ? (
            attendance.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Present</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">{record.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentPortal;