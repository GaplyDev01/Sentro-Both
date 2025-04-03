#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}News Impact Platform - Vercel Deployment Script${NC}"
echo -e "${YELLOW}Preparing for deployment...${NC}"

# Reference the verification document
echo -e "${YELLOW}Please check DEPLOYMENT_VERIFICATION.md for platform status and deployment readiness${NC}"

# Run pre-deployment check
echo -e "${YELLOW}Running pre-deployment checks...${NC}"
node pre-deploy-check.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Pre-deployment checks failed. Please fix the issues before deploying.${NC}"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo -e "${RED}Vercel CLI is not installed.${NC} Installing now..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Vercel CLI. Please install it manually:${NC}"
        echo "npm install -g vercel"
        exit 1
    fi
fi

# Check if user is logged in to Vercel
echo -e "${YELLOW}Checking Vercel authentication...${NC}"
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to log in to Vercel:${NC}"
    vercel login
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
cd src/frontend && npm install && cd ../..

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd src/frontend && npm run build && cd ../..

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${YELLOW}IMPORTANT: Don't forget to set up environment variables in the Vercel dashboard:${NC}"
    echo "- SUPABASE_URL"
    echo "- SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_KEY"
    echo "- JWT_SECRET"
    echo "- NEWS_API_KEY"
    echo "- RAPID_API_KEY"
    echo -e "${YELLOW}For more details, see DEPLOYMENT_VERIFICATION.md${NC}"
else
    echo -e "${RED}Deployment failed. Check the error messages above.${NC}"
fi 