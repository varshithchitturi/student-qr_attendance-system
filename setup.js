const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

// Import models
const User = require('./backend/models/User');
const Student = require('./backend/models/Student');

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('Cleared existing data');

    // Create demo student
    const demoStudent = new Student({
      name: 'John Doe',
      rollNo: 'CS2021001',
      email: 'john.doe@college.edu',
      department: 'Computer Science'
    });
    await demoStudent.save();

    // Create demo users
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'faculty',
        password: 'faculty123',
        role: 'faculty'
      },
      {
        username: 'student',
        password: 'student123',
        role: 'student',
        studentId: demoStudent._id
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created ${userData.role} user: ${userData.username}`);
    }

    console.log('\nDemo credentials:');
    console.log('Admin: admin/admin123');
    console.log('Faculty: faculty/faculty123');
    console.log('Student: student/student123');
    
    console.log('\nDatabase setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();