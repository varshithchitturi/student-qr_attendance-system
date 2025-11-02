import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Camera, Scan, CheckCircle, XCircle } from 'lucide-react';

const FacultyPage = () => {
  const [scanning, setScanning] = useState(false);
  const [location, setLocation] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
    fetchRecentAttendance();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          toast.error('Location access denied. Please enable location services.');
        }
      );
    }
  };

  const fetchRecentAttendance = async () => {
    try {
      const response = await api.get('/api/attendance/all/records');
      setRecentAttendance(response.data.slice(0, 10));
    } catch (error) {
      toast.error('Failed to fetch attendance records');
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (error) {
      toast.error('Camera access denied');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const captureAndProcessQR = async () => {
    if (!videoRef.current || !canvasRef.current || !location) {
      toast.error('Camera or location not available');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // In a real implementation, you would use a QR code scanning library here
    // For demo purposes, we'll simulate QR code detection
    const qrData = prompt('Enter QR code data (for demo):');
    
    if (qrData) {
      try {
        await api.post('/api/attendance/mark', {
          qrData,
          latitude: location.latitude,
          longitude: location.longitude
        });
        
        toast.success('Attendance marked successfully!');
        fetchRecentAttendance();
        stopScanning();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to mark attendance');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
        <p className="text-gray-600">Scan QR codes to mark student attendance</p>
      </motion.div>

      {/* QR Scanner Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card mb-8"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Scanner</h2>
          
          {!scanning ? (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-gray-600">Click to start scanning QR codes</p>
              <button
                onClick={startScanning}
                disabled={!location}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Scan className="h-4 w-4" />
                <span>Start Scanning</span>
              </button>
              {!location && (
                <p className="text-sm text-red-600">Waiting for location access...</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={captureAndProcessQR}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Capture QR</span>
                </button>
                <button
                  onClick={stopScanning}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
        <div className="space-y-3">
          {recentAttendance.length > 0 ? (
            recentAttendance.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {record.studentId?.name || 'Unknown Student'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Roll No: {record.studentId?.rollNo || 'N/A'}
                  </p>
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
            <p className="text-gray-500 text-center py-4">No attendance records yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyPage;