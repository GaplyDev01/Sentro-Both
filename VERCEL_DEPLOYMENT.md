# Deploying to Vercel

This guide provides step-by-step instructions for deploying the News Impact Platform to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed locally
3. [Node.js](https://nodejs.org/) (v14 or higher) installed locally
4. [Vercel CLI](https://vercel.com/docs/cli) installed globally (optional)

## Deployment Steps

### 1. Preparing Your Repository

Ensure your project is committed to a Git repository. If not:

```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. Deploy using Vercel CLI (Option 1)

1. Install Vercel CLI globally:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy your project:

```bash
vercel
```

4. Follow the CLI prompts:
   - Set up and deploy: `Y`
   - Select scope: Choose your account
   - Link to existing project: `N`
   - Project name: Enter a name or accept the default
   - Directory: `.`

### 3. Deploy using Vercel Web Interface (Option 2)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your Git repository
5. Configure your project:
   - Framework Preset: Other
   - Build Command: none (handled by vercel.json)
   - Output Directory: none (handled by vercel.json)
   - Install Command: npm install
6. Click "Deploy"

### 4. Setting Environment Variables

After initial deployment, configure environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service key
   - `JWT_SECRET` - Your JWT secret
   - `NEWS_API_KEY` - Your NewsAPI key
   - `RAPID_API_KEY` - Your RapidAPI key
4. Click "Save"
5. Redeploy your project for the changes to take effect

### 5. Domain Configuration (Optional)

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the instructions to verify ownership

### 6. Verifying Deployment

After deployment, verify:

1. Open the provided Vercel URL
2. Test authentication flows
3. Check that API endpoints work correctly
4. Verify database connections to Supabase

## Troubleshooting

- **API Connection Issues**: Check environment variables in Vercel dashboard
- **Build Failures**: Review build logs in the Vercel deployment details
- **CORS Errors**: Ensure frontend API calls use relative paths
- **Database Connectivity**: Verify Supabase credentials and IP allowlist

## Updating Your Deployment

Any push to your main branch will automatically trigger a new deployment on Vercel.

To manually redeploy:

```bash
vercel --prod
```

## Monitoring & Logs

1. Go to your project in the Vercel dashboard
2. Navigate to "Deployments" and select the specific deployment
3. Click on "Functions" to see serverless function logs
4. Use "Functions Metrics" to monitor performance 