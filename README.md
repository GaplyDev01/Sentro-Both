# News Impact Platform

## Project Overview
The News Impact Platform is an advanced application that provides businesses with personalized news insights and impact predictions. It enables users to understand how news events might affect their specific business, industry, and location.

Key features include:
- User authentication and profile management
- Curated news feed based on business industry and location
- Detailed impact predictions for news articles
- Responsive and intuitive UI

## Technologies Used

### Backend
- Node.js
- Express
- Supabase (PostgreSQL database)
- NewsAPI (for fetching news data)
- Repustate (for sentiment analysis)

### Frontend
- React.js
- React Router
- Material-UI
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- NewsAPI key
- Repustate API key

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/yourusername/news-impact-platform.git
   cd news-impact-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a Supabase project
   - Sign up at [Supabase](https://supabase.com/)
   - Create a new project
   - Execute the SQL schema from `supabase-schema.sql` in the SQL editor

4. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in your Supabase URL and key
   - Add your NewsAPI and Repustate API keys
   - Set your JWT secret

5. Start the backend server
   ```
   npm run dev:server
   ```

### Frontend Setup
1. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

2. Start the frontend development server
   ```
   npm run dev
   ```

## Project Structure
```
news-impact-platform/
├── src/
│   ├── backend/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express app
│   │
│   └── frontend/
│       ├── components/      # React components
│       ├── context/         # React context providers
│       ├── pages/           # Page components
│       ├── services/        # API service functions
│       ├── styles/          # CSS styles
│       ├── utils/           # Utility functions
│       └── App.js           # Main React component
│
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
├── supabase-schema.sql      # Supabase database schema
└── README.md                # Project documentation
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile

### User Management
- `PUT /api/users/profile` - Update user profile
- `PATCH /api/users/business-details` - Update business details

### News
- `GET /api/news` - Get curated news feed
- `GET /api/news/:id` - Get news article by ID

### Predictions
- `GET /api/predictions/:newsId` - Get prediction for a news article
- `GET /api/predictions/history` - Get user's prediction history

## Current Status

### Completed Tasks
- [x] Supabase database schema setup
- [x] Authentication controllers and routes
- [x] User management controllers and routes
- [x] News controllers and routes
- [x] Prediction controllers and routes
- [x] Middleware for authentication, validation, and error handling

### Current Tasks
- [ ] Set up frontend project structure
- [ ] Create layout and theme components
- [ ] Implement authentication pages (login, register)
- [ ] Create user profile and business setup pages
- [ ] Develop news feed and article detail pages
- [ ] Implement prediction visualization components

## Next Steps Before UI Development
1. Create a Supabase project and run the schema
2. Obtain API keys for NewsAPI and Repustate
3. Test API endpoints with Postman or similar tool
4. Set up frontend project structure and install dependencies

## Deployment Instructions
1. Build the frontend
   ```
   cd frontend
   npm run build
   ```

2. Deploy to a cloud provider of your choice (Vercel, Netlify, Heroku, etc.)

## License
This project is licensed under the MIT License. 