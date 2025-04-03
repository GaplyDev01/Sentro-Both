// Vercel build script to handle the deployment process
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vercel build process...');

try {
  // Log environment for debugging
  console.log('Node version:', process.version);
  console.log('Current directory:', process.cwd());
  console.log('Directory contents:', fs.readdirSync('.'));
  
  // Check if frontend directory exists
  const frontendDir = path.join(process.cwd(), 'src', 'frontend');
  if (!fs.existsSync(frontendDir)) {
    throw new Error(`Frontend directory not found at ${frontendDir}`);
  }
  
  console.log('Frontend directory exists, contents:', fs.readdirSync(frontendDir));
  
  // Navigate to frontend directory and install dependencies
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: frontendDir });
  
  // Build the frontend
  console.log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: frontendDir });
  
  console.log('Frontend build completed successfully!');

  // Check if build directory was created
  const buildDir = path.join(frontendDir, 'build');
  if (!fs.existsSync(buildDir)) {
    throw new Error(`Build directory not found at ${buildDir}`);
  }
  
  console.log('Build directory exists, contents:', fs.readdirSync(buildDir));
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
