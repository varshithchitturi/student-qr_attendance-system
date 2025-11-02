import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Users, UserPlus, BarChart3, QrCode } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', rollNo: '', email: '', department: '', username: '', password: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students/all');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/api/attendance/all/records');
      setAttendance(response.data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/students/register', formData);
      toast.success('Student registered successfully!');
      setShowRegisterForm(false);
      setFormData({ name: '', rollNo: '', email: '', department: '', username: '', password: '' });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const generateQR = async (studentId) => {
    try {
      const response = await api.get(`/api/students/generate-qr/${studentId}`);
      const link = document.createElement('a');
      link.href = response.data.qrCode;
      link.download = `qr-code-${studentId}.png`;
      link.click();
      toast.success('QR code generated and downloaded!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const attendanceData = attendance.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []).slice(-7);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage students and view attendance reports</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Students</h2>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register Student</span>
        </button>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => generateQR(student._id)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Generate QR</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New Student</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNo}
                onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 btn-primary">
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;