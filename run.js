const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting College QR Attendance System...\n');

// Start backend
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

// Start frontend after 2 seconds
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit'
  });
  
  console.log('\n✅ Backend: http://localhost:5001');
  console.log('✅ Frontend: http://localhost:3000');
  console.log('\nDemo Credentials:');
  console.log('Admin: admin/admin123');
  console.log('Faculty: faculty/faculty123');
  console.log('Student: student/student123\n');
}, 2000);

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
});