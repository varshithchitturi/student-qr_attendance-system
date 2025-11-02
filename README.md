# College QR Attendance System

A complete full-stack web application for managing student attendance using QR codes with location verification.

## Features

- **Admin Dashboard**: Register students, generate QR codes, view attendance analytics
- **Faculty Interface**: Scan QR codes using device camera to mark attendance
- **Student Portal**: View personal QR code and attendance history
- **Location Verification**: Attendance only marked within college premises
- **JWT Authentication**: Secure role-based access (admin, faculty, student)
- **Real-time Analytics**: Charts and statistics for attendance tracking
- **Responsive Design**: Mobile-friendly interface with modern UI

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- QR Code generation
- Location-based validation

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for analytics
- React Router for navigation
- Axios for API calls

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Modern web browser with camera access

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr_attendance
JWT_SECRET=your_jwt_secret_key_here
COLLEGE_LAT=40.7128
COLLEGE_LNG=-74.0060
COLLEGE_RADIUS=500
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Default Credentials

The system comes with demo credentials for testing:

- **Admin**: username: `admin`, password: `admin123`
- **Faculty**: username: `faculty`, password: `faculty123`
- **Student**: username: `student`, password: `student123`

### Admin Workflow

1. Login with admin credentials
2. Register new students with their details
3. Generate QR codes for students
4. View attendance analytics and reports

### Faculty Workflow

1. Login with faculty credentials
2. Click "Start Scanning" to activate camera
3. Scan student QR codes to mark attendance
4. View recent attendance records

### Student Workflow

1. Login with student credentials
2. Generate personal QR code (valid for 24 hours)
3. Show QR code to faculty for attendance marking
4. View attendance history and statistics

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `POST /api/students/register` - Register new student (admin only)
- `GET /api/students/generate-qr/:id` - Generate QR code
- `GET /api/students/all` - Get all students (admin only)
- `GET /api/students/profile` - Get student profile

### Attendance
- `POST /api/attendance/mark` - Mark attendance (faculty only)
- `GET /api/attendance/:id` - Get student attendance
- `GET /api/attendance/all/records` - Get all attendance (admin only)
- `GET /api/attendance/student/my-attendance` - Get own attendance

## Security Features

- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Location verification for attendance
- QR code expiration (24 hours)
- One attendance per day per student

## Location Configuration

Update the college coordinates in `.env`:
- `COLLEGE_LAT`: College latitude
- `COLLEGE_LNG`: College longitude  
- `COLLEGE_RADIUS`: Allowed radius in meters (default: 500m)

## Development

### Project Structure
```
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

### Adding New Features

1. Backend: Add routes in `routes/` directory
2. Frontend: Add components in `src/components/` or pages in `src/pages/`
3. Update authentication middleware for protected routes
4. Add proper error handling and validation

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Configure API base URL for production

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request

## License

MIT License - see LICENSE file for details