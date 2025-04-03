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

### Deployment
- Vercel (Serverless Functions & Static Site Hosting)

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
   cd src/frontend
   npm install
   ```

2. Start the frontend development server
   ```
   npm run dev:client
   ```

3. Or start both frontend and backend together
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
├── .env.production          # Production environment variables
├── vercel.json              # Vercel deployment configuration
├── deploy.sh                # Deployment script
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
- [x] Frontend project structure setup
- [x] Layout and theme components
- [x] Authentication pages (login, register)
- [x] User profile and business setup pages
- [x] News feed and article detail pages
- [x] Prediction visualization components
- [x] Vercel deployment configuration

## Deployment Verification

Before deploying the News Impact Platform, a comprehensive verification process should be completed to ensure everything works as expected. We've created several tools to facilitate this process:

### Verification Scripts

- **Full Verification Process**: Run the entire verification suite
  ```
  npm run verify
  ```

- **Unit Tests**: Run automated tests
  ```
  npm test
  ```

- **Manual Testing**: Interactive checklist for verifying user flows
  ```
  npm run manual-test
  ```

- **Performance Testing**: Measure page load and API response times
  ```
  npm run performance-test
  ```

- **Accessibility Testing**: Test WCAG compliance
  ```
  npm run accessibility-test
  ```

### Verification Reports

The verification process generates several reports:
- Unit test coverage in the `coverage/` directory
- Performance metrics in `performance-report.html`
- Accessibility results in `accessibility-reports/`
- Manual test results in `PRE_DEPLOYMENT_TEST_PLAN.md`
- Overall verification summary in `DEPLOYMENT_VERIFICATION.md`

For detailed instructions, see [DEPLOYMENT_VERIFICATION_GUIDE.md](DEPLOYMENT_VERIFICATION_GUIDE.md).

## Deployment Instructions

### Deploy to Vercel (Recommended)

#### Quick Method (Script)
Run the deployment script:
```
./deploy.sh
```

#### Manual Method
1. Install Vercel CLI
   ```
   npm install -g vercel
   ```

2. Login to Vercel
   ```
   vercel login
   ```

3. Deploy to Vercel
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

#### Important Environment Variables
After deploying to Vercel, set up these environment variables in the Vercel dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `NEWS_API_KEY`
- `RAPID_API_KEY`

For detailed deployment instructions, refer to [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).

## License
This project is licensed under the MIT License. 