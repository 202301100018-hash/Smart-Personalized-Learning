# AI Learning Roadmap Application

A modern, interactive, and responsive React.js frontend for an AI-based learning roadmap application. This application helps users create personalized learning paths with video recommendations, interactive quizzes, and progress tracking.

## Features

### 🎯 Core Functionality
- **Personalized Learning Roadmaps**: Generate custom learning paths based on course name and duration
- **Daily Topic Organization**: Structured daily learning with color-coded milestones
- **Video Recommendations**: Curated YouTube videos for each topic with thumbnails and duration
- **Interactive Quizzes**: Multiple-choice quizzes with immediate feedback
- **Progress Tracking**: Real-time progress visualization with charts and statistics

### 🎨 Design Features
- **Modern UI/UX**: Clean, glass-morphism design with smooth animations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, smooth transitions, and engaging animations
- **Color-coded Progress**: Visual indicators for completed topics and days
- **Beautiful Charts**: Progress visualization using Chart.js with doughnut and bar charts

### 🚀 Technical Features
- **React.js**: Modern React with hooks and functional components
- **React Router**: Client-side routing for seamless navigation
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Chart.js**: Interactive charts for progress visualization
- **Lucide React**: Beautiful, customizable icons

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd SMART
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js      # Landing page with course input form
│   ├── Dashboard.js        # Main dashboard with roadmap and progress
│   ├── VideoCard.js        # Video recommendation cards
│   ├── QuizModal.js        # Interactive quiz modal
│   └── ProgressChart.js    # Progress visualization charts
├── data/
│   └── mockData.js         # Mock data for topics, videos, and quizzes
├── App.js                  # Main app component with routing
├── index.js               # React app entry point
└── index.css              # Global styles and Tailwind imports
```

## Usage Guide

### 1. Landing Page
- Enter a course name (e.g., "React Development")
- Select learning duration (7, 14, 21, or 30 days)
- Click "Generate Roadmap" to create your learning path

### 2. Dashboard
- **Day Selection**: Click on day buttons to navigate between learning days
- **Topic Management**: View topics for each day with descriptions and difficulty levels
- **Video Learning**: Click on video cards to open YouTube videos in new tabs
- **Quiz Taking**: Click "Quiz" button on any topic to test your knowledge
- **Progress Tracking**: Monitor your completion percentage and learning streak

### 3. Interactive Features
- **Topic Completion**: Mark topics as complete to track progress
- **Day Completion**: Complete entire days to build learning streaks
- **Quiz System**: Take quizzes with immediate feedback and score tracking
- **Progress Visualization**: View detailed charts showing your learning progress

## Mock Data

The application uses mock data for demonstration purposes:

- **5 Sample Topics**: Covering React fundamentals, state management, lifecycle, routing, and API integration
- **5 Video Recommendations**: Curated YouTube videos with thumbnails and durations
- **5 Quiz Sets**: Multiple-choice questions for each topic with correct answers

## Customization

### Adding New Topics
Edit `src/data/mockData.js` to add new topics, videos, and quizzes:

```javascript
export const mockTopics = [
  {
    id: 6,
    title: "Your New Topic",
    description: "Topic description",
    duration: "2 hours",
    difficulty: "Beginner",
    category: "Your Category"
  }
  // ... existing topics
];
```

### Styling Customization
- Modify `tailwind.config.js` for color schemes and animations
- Update `src/index.css` for global styles and custom classes
- Customize component styles using Tailwind utility classes

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Features

- **Lazy Loading**: Components load efficiently
- **Optimized Animations**: Smooth 60fps animations with Framer Motion
- **Responsive Images**: Optimized video thumbnails
- **Efficient State Management**: Local state management for optimal performance

## Future Enhancements

- Backend integration for persistent data
- User authentication and profiles
- Social features (sharing progress, leaderboards)
- Advanced analytics and insights
- Offline support with service workers
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React.js, Tailwind CSS, and Framer Motion**
