/**
 * News Impact Platform - Manual Testing Script
 * 
 * This script helps testers systematically work through the manual testing
 * process and record results in the PRE_DEPLOYMENT_TEST_PLAN.md file.
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Path to the test plan
const testPlanPath = path.join(__dirname, 'PRE_DEPLOYMENT_TEST_PLAN.md');

/**
 * Parse the test plan file to extract test cases
 */
function parseTestPlan() {
  const content = fs.readFileSync(testPlanPath, 'utf8');
  const sections = [];
  let currentSection = null;
  let inTable = false;
  let tableHeaders = [];
  
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Section headers
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      
      currentSection = {
        title: line.replace('## ', ''),
        testCases: []
      };
      
      inTable = false;
    } 
    // Table headers
    else if (line.includes('| Test Case |')) {
      inTable = true;
      tableHeaders = line
        .split('|')
        .map(h => h.trim())
        .filter(h => h);
    }
    // Table separator line, skip
    else if (line.includes('|---')) {
      continue;
    }
    // Table content
    else if (inTable && line.startsWith('|')) {
      const cells = line
        .split('|')
        .map(c => c.trim())
        .filter(c => c);
      
      if (cells.length >= 3) {
        currentSection.testCases.push({
          name: cells[0],
          steps: cells[1].replace(/<br>/g, '\n'),
          expected: cells[2],
          status: cells[3] || '⏳'
        });
      }
    }
  }
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Update the test plan with new test results
 */
function updateTestPlan(sections) {
  let updatedContent = '# News Impact Platform - Pre-Deployment Test Plan\n\n';
  updatedContent += '## Overview\nThis document outlines the comprehensive testing plan for the News Impact Platform prior to deployment. Each section represents a critical feature or component that must be verified before the site can be considered ready for production.\n\n';
  
  for (const section of sections) {
    updatedContent += `## ${section.title}\n\n`;
    updatedContent += '| Test Case | Test Steps | Expected Result | Status |\n';
    updatedContent += '|-----------|------------|-----------------|--------|\n';
    
    for (const testCase of section.testCases) {
      const formattedSteps = testCase.steps.replace(/\n/g, '<br>');
      updatedContent += `| ${testCase.name} | ${formattedSteps} | ${testCase.expected} | ${testCase.status} |\n`;
    }
    
    updatedContent += '\n';
  }
  
  // Add the execution plan and tools sections
  updatedContent += `## Test Execution Plan

1. Manual testing of all user flows
2. Automated tests for critical paths
3. Cross-browser testing
4. Mobile/responsive testing
5. Performance testing
6. Accessibility audit
7. Security review

## Testing Tools

- Jest for unit/component testing
- Lighthouse for performance and accessibility
- Browser devtools for network and performance analysis
- WAVE or axe for accessibility testing
- Manual testing checklist for UX verification`;
  
  fs.writeFileSync(testPlanPath, updatedContent);
  console.log(`${colors.green}Test plan updated!${colors.reset}`);
}

/**
 * Run a specific test case interactively
 */
async function runTestCase(section, testCase) {
  return new Promise((resolve) => {
    console.log(`\n${colors.magenta}=== Running Test: ${testCase.name} ===${colors.reset}`);
    console.log(`${colors.cyan}Section: ${section.title}${colors.reset}`);
    console.log('\nTest Steps:');
    console.log(testCase.steps);
    console.log('\nExpected Result:');
    console.log(testCase.expected);
    
    rl.question(`\n${colors.yellow}Did the test pass? (y/n/s/q - yes/no/skip/quit): ${colors.reset}`, (answer) => {
      if (answer.toLowerCase() === 'y') {
        testCase.status = '✅'; // Passed
        console.log(`${colors.green}Test marked as PASSED${colors.reset}`);
      } else if (answer.toLowerCase() === 'n') {
        rl.question(`${colors.red}Enter failure details: ${colors.reset}`, (details) => {
          testCase.status = `❌ ${details}`;
          console.log(`${colors.red}Test marked as FAILED${colors.reset}`);
          resolve();
        });
        return;
      } else if (answer.toLowerCase() === 'q') {
        console.log(`${colors.yellow}Quitting test execution${colors.reset}`);
        process.exit(0);
      } else {
        console.log(`${colors.yellow}Test skipped${colors.reset}`);
      }
      resolve();
    });
  });
}

/**
 * Start the testing process
 */
async function startTesting() {
  console.log(`${colors.blue}====================================${colors.reset}`);
  console.log(`${colors.blue}  News Impact Platform Test Runner  ${colors.reset}`);
  console.log(`${colors.blue}====================================${colors.reset}`);
  
  const sections = parseTestPlan();
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  
  for (const section of sections) {
    console.log(`\n${colors.blue}==== Section: ${section.title} ====${colors.reset}`);
    
    for (const testCase of section.testCases) {
      totalTests++;
      const originalStatus = testCase.status;
      
      await runTestCase(section, testCase);
      
      if (testCase.status === '✅') {
        passedTests++;
      } else if (testCase.status.startsWith('❌')) {
        failedTests++;
      } else if (testCase.status === '⏳' && originalStatus === '⏳') {
        skippedTests++;
      }
      
      // Update the test plan file after each test case
      updateTestPlan(sections);
    }
  }
  
  console.log(`\n${colors.blue}====================================${colors.reset}`);
  console.log(`${colors.blue}  Testing Complete  ${colors.reset}`);
  console.log(`${colors.blue}====================================${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${skippedTests}${colors.reset}`);
  console.log(`${colors.blue}Total: ${totalTests}${colors.reset}`);
  
  rl.close();
}

// Start the application
console.log(`${colors.cyan}Starting manual test execution...${colors.reset}`);
startTesting(); 