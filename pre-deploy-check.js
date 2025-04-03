#!/usr/bin/env node

/**
 * Pre-deployment check script for News Impact Platform
 * This script verifies that all required components and configurations are in place
 * before deploying to Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.blue}Starting pre-deployment checks...${colors.reset}`);

// Track issues
const issues = [];
const warnings = [];

// Check required files
const requiredFiles = [
  'vercel.json',
  'src/backend/server.js',
  'src/frontend/package.json',
  '.env.production',
  'deploy.sh'
];

console.log(`${colors.blue}Checking required files...${colors.reset}`);
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`Missing required file: ${file}`);
    console.log(`${colors.red}✘ Missing: ${file}${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Found: ${file}${colors.reset}`);
  }
});

// Check frontend build
console.log(`\n${colors.blue}Checking frontend build...${colors.reset}`);
if (!fs.existsSync('src/frontend/build')) {
  warnings.push('Frontend build directory does not exist. Run build before deploying.');
  console.log(`${colors.yellow}⚠ Frontend not built yet. Will be built during deployment.${colors.reset}`);
} else {
  console.log(`${colors.green}✓ Frontend build exists${colors.reset}`);
}

// Check environment variables
console.log(`\n${colors.blue}Checking environment variables...${colors.reset}`);
const envProduction = fs.readFileSync('.env.production', 'utf8');
const requiredEnvVars = [
  'NODE_ENV=production',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
  'NEWS_API_KEY',
  'RAPID_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  const varName = envVar.split('=')[0];
  if (envProduction.includes(varName) && !envProduction.includes(`# ${varName}`)) {
    console.log(`${colors.green}✓ Found: ${varName}${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Not set: ${varName} (will need to be set in Vercel dashboard)${colors.reset}`);
    warnings.push(`Environment variable ${varName} not set`);
  }
});

// Check backend dependencies
console.log(`\n${colors.blue}Checking backend dependencies...${colors.reset}`);
try {
  const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@supabase/supabase-js',
    'express',
    'cors',
    'helmet'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJSON.dependencies[dep]) {
      console.log(`${colors.green}✓ Found: ${dep}${colors.reset}`);
    } else {
      console.log(`${colors.red}✘ Missing: ${dep}${colors.reset}`);
      issues.push(`Missing backend dependency: ${dep}`);
    }
  });
} catch (error) {
  console.log(`${colors.red}✘ Error checking package.json: ${error.message}${colors.reset}`);
  issues.push('Could not read package.json');
}

// Check frontend dependencies
console.log(`\n${colors.blue}Checking frontend dependencies...${colors.reset}`);
try {
  const frontendPackageJSON = JSON.parse(fs.readFileSync('src/frontend/package.json', 'utf8'));
  const requiredFrontendDeps = [
    'react',
    'react-dom',
    'axios'
  ];
  
  requiredFrontendDeps.forEach(dep => {
    if (frontendPackageJSON.dependencies[dep]) {
      console.log(`${colors.green}✓ Found: ${dep}${colors.reset}`);
    } else {
      console.log(`${colors.red}✘ Missing: ${dep}${colors.reset}`);
      issues.push(`Missing frontend dependency: ${dep}`);
    }
  });
} catch (error) {
  console.log(`${colors.red}✘ Error checking frontend package.json: ${error.message}${colors.reset}`);
  issues.push('Could not read frontend package.json');
}

// Summary
console.log(`\n${colors.blue}==== Deployment Check Summary =====${colors.reset}`);

if (issues.length > 0) {
  console.log(`\n${colors.red}Issues that must be fixed:${colors.reset}`);
  issues.forEach(issue => console.log(`${colors.red}✘ ${issue}${colors.reset}`));
}

if (warnings.length > 0) {
  console.log(`\n${colors.yellow}Warnings:${colors.reset}`);
  warnings.forEach(warning => console.log(`${colors.yellow}⚠ ${warning}${colors.reset}`));
}

if (issues.length === 0 && warnings.length === 0) {
  console.log(`\n${colors.green}✓ All checks passed! The application is ready for deployment.${colors.reset}`);
  process.exit(0);
} else if (issues.length === 0) {
  console.log(`\n${colors.yellow}⚠ Application can be deployed, but there are warnings to consider.${colors.reset}`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}✘ Application has issues that must be fixed before deployment.${colors.reset}`);
  process.exit(1);
} 