# Serverless API Functions

This directory contains serverless functions for the News Impact Platform. The functions are deployed as Vercel serverless functions and follow the Vercel API routing structure.

## Architecture

- `index.js`: The main Express app that handles middleware setup and routing
- `health.js`: Simple health check endpoint (/api/health)
- `/auth/[...route].js`: Handles authentication-related endpoints
- `/users/[...route].js`: Handles user-related endpoints
- `/news/[...route].js`: Handles news-related endpoints
- `/predictions/[...route].js`: Handles prediction-related endpoints

## How it Works

1. The Express app in `index.js` configures all middleware and routes
2. Each route-specific file acts as a handler that proxies requests to the main Express app
3. The `vercel.json` file routes incoming requests to the appropriate serverless function
4. URL rewrites are handled in each serverless function to ensure proper routing

### Route Handling

The route handlers use Vercel's catch-all routes feature to handle all requests to a particular endpoint type. For example:

- A request to `/api/auth/login` will be routed to `/api/auth/[...route].js?route=login`
- The handler extracts the `route` parameter and rewrites the URL before passing it to the Express app

## Development vs. Production

- In development, you can continue to use the Express server in `src/backend/server.js`
- In production, the Vercel deployment will use these serverless functions
- The controllers, models, and services are shared between both environments

## Debugging & Logs

Logging has been added to help diagnose any issues:
- Request details are logged at the root level in `index.js`
- Each route handler logs when it's called and how the URL is rewritten
- The health check endpoint provides a simple way to verify the API is running

## Testing

To test these serverless functions locally:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` in the project root
3. Access the health check endpoint at http://localhost:3000/api/health
4. The API endpoints will be available at `http://localhost:3000/api/{endpoint-path}` 