# 🔧 Technical Requirements - Next Semester Implementation

## 🗄️ **Database Schema Design**

### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    learningGoals: [String],
    preferredLanguage: String,
    timezone: String
  },
  preferences: {
    studyHours: Number,
    skillLevel: String,
    notifications: Boolean,
    darkMode: Boolean
  },
  subscription: {
    plan: String, // free, premium, pro
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### **Courses Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // creator
  title: String,
  description: String,
  category: String,
  subcategory: String,
  topics: [String],
  duration: Number,
  skillLevel: String,
  roadmap: [{
    day: Number,
    title: String,
    description: String,
    duration: String,
    difficulty: String,
    videos: [VideoSchema],
    quiz: QuizSchema,
    completed: Boolean
  }],
  isPublic: Boolean,
  likes: Number,
  enrollments: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **Progress Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  progress: {
    currentDay: Number,
    completedDays: [Number],
    completedTopics: [String],
    totalTimeSpent: Number, // minutes
    quizScores: [{
      day: Number,
      score: Number,
      totalQuestions: Number,
      completedAt: Date
    }],
    streak: {
      current: Number,
      longest: Number,
      lastStudyDate: Date
    }
  },
  analytics: {
    averageSessionTime: Number,
    preferredStudyTime: String,
    weakAreas: [String],
    strongAreas: [String]
  },
  startedAt: Date,
  lastAccessed: Date,
  completedAt: Date
}
```

## 🔐 **Authentication System**

### **JWT Token Structure**
```javascript
// JWT Payload
{
  userId: ObjectId,
  email: String,
  role: String, // student, instructor, admin
  subscription: String,
  iat: Number,
  exp: Number
}

// Refresh Token
{
  userId: ObjectId,
  tokenId: String,
  expiresAt: Date,
  isRevoked: Boolean
}
```

### **Auth Middleware**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

## 🌐 **API Endpoints Structure**

### **Authentication Routes**
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### **User Routes**
```javascript
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/dashboard
GET    /api/users/analytics
PUT    /api/users/preferences
DELETE /api/users/account
```

### **Course Routes**
```javascript
GET    /api/courses              // Public courses
POST   /api/courses              // Create course
GET    /api/courses/:id          // Get specific course
PUT    /api/courses/:id          // Update course
DELETE /api/courses/:id          // Delete course
POST   /api/courses/:id/enroll   // Enroll in course
GET    /api/courses/my-courses   // User's courses
```

### **Progress Routes**
```javascript
GET    /api/progress/:courseId
PUT    /api/progress/:courseId/day/:dayId
POST   /api/progress/:courseId/quiz
GET    /api/progress/analytics
PUT    /api/progress/streak
```

## 📱 **Frontend State Management**

### **Context Structure**
```javascript
// contexts/AppContext.js
const AppContext = {
  user: {
    profile: UserProfile,
    preferences: UserPreferences,
    subscription: SubscriptionInfo
  },
  courses: {
    enrolled: [Course],
    created: [Course],
    public: [Course]
  },
  progress: {
    current: CourseProgress,
    analytics: ProgressAnalytics,
    streak: StreakInfo
  },
  ui: {
    theme: 'light' | 'dark',
    loading: Boolean,
    notifications: [Notification]
  }
}
```

### **API Service Layer**
```javascript
// services/api.js
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL;
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    return this.handleResponse(response);
  }

  // Auth methods
  async login(credentials) { /* */ }
  async register(userData) { /* */ }
  async logout() { /* */ }

  // Course methods
  async getCourses() { /* */ }
  async createCourse(courseData) { /* */ }
  async enrollCourse(courseId) { /* */ }

  // Progress methods
  async getProgress(courseId) { /* */ }
  async updateProgress(courseId, progressData) { /* */ }
}
```

## 🔄 **Real-time Features**

### **Socket.io Integration**
```javascript
// server/socket.js
const socketAuth = require('./middleware/socketAuth');

io.use(socketAuth);

io.on('connection', (socket) => {
  // Join user-specific room
  socket.join(`user_${socket.userId}`);
  
  // Progress updates
  socket.on('progress_update', (data) => {
    // Update database
    // Broadcast to user's devices
    socket.to(`user_${socket.userId}`).emit('progress_sync', data);
  });
  
  // Study session tracking
  socket.on('study_start', (courseId) => {
    // Track session start
  });
  
  socket.on('study_end', (sessionData) => {
    // Update analytics
  });
});
```

## 📊 **Analytics & Tracking**

### **Learning Analytics Schema**
```javascript
{
  userId: ObjectId,
  courseId: ObjectId,
  sessionData: [{
    startTime: Date,
    endTime: Date,
    duration: Number,
    topicsStudied: [String],
    videosWatched: [String],
    quizzesTaken: [String],
    deviceType: String,
    location: String
  }],
  learningPatterns: {
    mostActiveHours: [Number],
    preferredDays: [String],
    averageSessionLength: Number,
    completionRate: Number
  },
  performance: {
    averageQuizScore: Number,
    improvementRate: Number,
    weakTopics: [String],
    strongTopics: [String]
  }
}
```

## 🔒 **Security Implementation**

### **Security Middleware**
```javascript
// middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Input sanitization
app.use(mongoSanitize());
app.use(helmet());
app.use(limiter);
```

### **Data Validation**
```javascript
// validation/schemas.js
const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
});

const courseCreationSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).max(500).required(),
  category: Joi.string().required(),
  duration: Joi.number().min(1).max(365).required(),
  skillLevel: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required()
});
```

## 📱 **Mobile PWA Configuration**

### **Service Worker**
```javascript
// public/sw.js
const CACHE_NAME = 'smart-learning-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### **PWA Manifest**
```json
{
  "name": "SMART Learning Platform",
  "short_name": "SMART Learn",
  "description": "AI-powered personalized learning platform",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#1F2937",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🚀 **Deployment Configuration**

### **Docker Setup**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### **Environment Variables**
```bash
# .env.production
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-learning
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
OPENAI_API_KEY=your-openai-api-key
EMAIL_SERVICE_API_KEY=your-email-service-key
AWS_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

This technical specification provides the foundation for implementing all the features planned for next semester! 🚀