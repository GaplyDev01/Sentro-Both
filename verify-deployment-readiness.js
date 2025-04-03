#!/usr/bin/env node

/**
 * News Impact Platform - Deployment Readiness Verification
 * 
 * This is a master script that runs all verification tests to ensure
 * the platform is ready for deployment.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Create a readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// List of verification steps and their scripts
const verificationSteps = [
  {
    name: 'Unit Tests',
    command: 'npm',
    args: ['test'],
    description: 'Run automated unit tests and view coverage',
    required: true
  },
  {
    name: 'Manual Feature Testing',
    command: 'node',
    args: ['run_manual_testing.js'],
    description: 'Systematically test all features and user flows',
    required: true
  },
  {
    name: 'Performance Testing',
    command: 'node',
    args: ['performance_test.js'],
    description: 'Measure performance metrics including load times',
    required: false
  },
  {
    name: 'Accessibility Testing',
    command: 'node',
    args: ['accessibility_test.js'],
    description: 'Verify compliance with accessibility standards',
    required: false
  },
  {
    name: 'Build Frontend',
    command: 'cd',
    args: ['src/frontend', '&&', 'npm', 'run', 'build'],
    description: 'Build the frontend production bundle',
    required: true,
    shell: true
  },
  {
    name: 'Environment Variables Check',
    command: 'node',
    args: ['-e', "console.log('Checking environment variables...'); const requiredVars = ['NODE_ENV', 'DB_URI', 'JWT_SECRET', 'PORT', 'API_BASE_URL']; const missing = requiredVars.filter(v => !process.env[v]); if(missing.length) { console.error('Missing required env vars:', missing); process.exit(1); } else { console.log('All required environment variables are set.'); }"],
    description: 'Verify all required environment variables are set',
    required: true
  }
];

// Results storage
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: {}
};

/**
 * Run a command as a promise
 * @param {string} command - Command to run
 * @param {string[]} args - Command arguments
 * @param {boolean} useShell - Whether to use shell
 * @returns {Promise<{exitCode: number, output: string}>} - Command result
 */
function runCommand(command, args, useShell = false) {
  return new Promise((resolve) => {
    let output = '';
    let cmd;
    
    if (useShell) {
      // Join command and args for shell execution
      const fullCommand = [command, ...args].join(' ');
      cmd = spawn(fullCommand, [], { shell: true });
    } else {
      cmd = spawn(command, args);
    }
    
    cmd.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });
    
    cmd.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });
    
    cmd.on('close', (code) => {
      resolve({ exitCode: code, output });
    });
  });
}

/**
 * Print a section heading
 * @param {string} text - Heading text
 */
function printHeading(text) {
  const line = '='.repeat(text.length + 4);
  console.log('\n' + colors.cyan + line + colors.reset);
  console.log(colors.cyan + '= ' + colors.bright + text + colors.reset + colors.cyan + ' =' + colors.reset);
  console.log(colors.cyan + line + colors.reset + '\n');
}

/**
 * Ask the user if they want to run a step
 * @param {Object} step - Verification step
 * @returns {Promise<boolean>} - Whether to run the step
 */
async function confirmStep(step) {
  if (step.required) {
    console.log(`${colors.yellow}This is a required step and cannot be skipped.${colors.reset}`);
    return true;
  }
  
  return new Promise((resolve) => {
    rl.question(`Run this step? (Y/n): `, (answer) => {
      const normalizedAnswer = answer.trim().toLowerCase();
      resolve(normalizedAnswer === '' || normalizedAnswer === 'y' || normalizedAnswer === 'yes');
    });
  });
}

/**
 * Generate a summary report of all test results
 */
function generateSummaryReport() {
  printHeading('VERIFICATION SUMMARY');
  
  console.log(`Total steps: ${verificationSteps.length}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}\n`);
  
  console.log(colors.bright + 'Detailed Results:' + colors.reset);
  for (const [name, result] of Object.entries(results.details)) {
    let statusColor = colors.yellow;
    let statusText = 'SKIPPED';
    
    if (result.ran) {
      statusColor = result.exitCode === 0 ? colors.green : colors.red;
      statusText = result.exitCode === 0 ? 'PASSED' : 'FAILED';
    }
    
    console.log(`${name}: ${statusColor}${statusText}${colors.reset}`);
  }
  
  console.log('\n');
  
  // Return a summary object with boolean indicating overall success
  return {
    success: results.failed === 0 && results.skipped === 0,
    totalSteps: verificationSteps.length,
    passed: results.passed,
    failed: results.failed,
    skipped: results.skipped
  };
}

/**
 * Update the DEPLOYMENT_VERIFICATION.md file with test results
 * @param {Object} summary - Test summary
 */
function updateVerificationDoc(summary) {
  const verificationPath = path.join(__dirname, 'DEPLOYMENT_VERIFICATION.md');
  
  if (!fs.existsSync(verificationPath)) {
    console.warn(`${colors.yellow}Warning: DEPLOYMENT_VERIFICATION.md not found, skipping update${colors.reset}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(verificationPath, 'utf8');
    
    // Add verification results section
    const verificationSection = `
## Pre-Deployment Verification Results

**Run Date:** ${new Date().toISOString().split('T')[0]}

**Overall Status:** ${summary.success ? '✅ PASSED' : '❌ FAILED'}

**Steps Summary:**
- Total Steps: ${summary.totalSteps}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Skipped: ${summary.skipped}

### Detailed Results

${Object.entries(results.details)
  .map(([name, result]) => {
    let status = '⏳ SKIPPED';
    if (result.ran) {
      status = result.exitCode === 0 ? '✅ PASSED' : '❌ FAILED';
    }
    return `- ${name}: ${status}`;
  })
  .join('\n')}

${summary.success 
  ? '**The platform has passed all required verification steps and is ready for deployment.**' 
  : '**The platform has failed one or more verification steps and is NOT ready for deployment.**'}
`;
    
    // Check if there's already a verification results section
    if (content.includes('## Pre-Deployment Verification Results')) {
      // Replace existing section
      content = content.replace(
        /## Pre-Deployment Verification Results[\s\S]*?(?=##|$)/,
        verificationSection
      );
    } else {
      // Add new section before deployment instructions
      if (content.includes('## Deployment Instructions')) {
        content = content.replace(
          '## Deployment Instructions',
          `${verificationSection}\n\n## Deployment Instructions`
        );
      } else {
        // Just append to the end
        content += verificationSection;
      }
    }
    
    fs.writeFileSync(verificationPath, content);
    console.log(`${colors.green}Updated DEPLOYMENT_VERIFICATION.md with test results${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error updating verification document:${colors.reset}`, error);
  }
}

/**
 * Run the verification process
 */
async function runVerification() {
  printHeading('NEWS IMPACT PLATFORM - DEPLOYMENT VERIFICATION');
  console.log('This script will run through all verification steps to ensure the platform is ready for deployment.\n');
  
  for (let i = 0; i < verificationSteps.length; i++) {
    const step = verificationSteps[i];
    
    printHeading(`STEP ${i+1}/${verificationSteps.length}: ${step.name}`);
    console.log(`${colors.dim}${step.description}${colors.reset}\n`);
    
    const shouldRun = await confirmStep(step);
    
    if (shouldRun) {
      console.log(`\n${colors.cyan}Running ${step.name}...${colors.reset}\n`);
      
      const { exitCode, output } = await runCommand(step.command, step.args, step.shell);
      
      results.details[step.name] = {
        ran: true,
        exitCode,
        output
      };
      
      if (exitCode === 0) {
        results.passed++;
        console.log(`\n${colors.green}✓ ${step.name} completed successfully${colors.reset}`);
      } else {
        results.failed++;
        console.log(`\n${colors.red}✗ ${step.name} failed with exit code ${exitCode}${colors.reset}`);
        
        if (step.required) {
          console.log(`\n${colors.red}This is a required step. Verification cannot continue.${colors.reset}`);
          break;
        }
      }
    } else {
      results.skipped++;
      results.details[step.name] = {
        ran: false
      };
      
      console.log(`\n${colors.yellow}Skipped ${step.name}${colors.reset}`);
    }
    
    // Pause between steps unless it's the last one
    if (i < verificationSteps.length - 1) {
      await new Promise((resolve) => {
        rl.question('\nPress Enter to continue to the next step...', resolve);
      });
    }
  }
  
  const summary = generateSummaryReport();
  updateVerificationDoc(summary);
  
  rl.close();
  
  // Final message
  if (summary.success) {
    console.log(`${colors.bgGreen}${colors.black} VERIFICATION SUCCESSFUL ${colors.reset}`);
    console.log(`${colors.green}The platform has passed all required verification steps and is ready for deployment.${colors.reset}`);
  } else {
    console.log(`${colors.bgRed}${colors.white} VERIFICATION FAILED ${colors.reset}`);
    console.log(`${colors.red}The platform has failed one or more verification steps and is NOT ready for deployment.${colors.reset}`);
    console.log(`${colors.yellow}Please review the results and address any issues before attempting deployment.${colors.reset}`);
  }
}

// Run the verification
runVerification().catch(error => {
  console.error(`${colors.red}Error during verification:${colors.reset}`, error);
  process.exit(1);
}); 