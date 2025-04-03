/**
 * News Impact Platform - Accessibility Testing Script
 * 
 * This script runs accessibility tests on the application using axe-core
 * to identify accessibility issues and generate a report.
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  pages: [
    { path: '/', name: 'Home Page' },
    { path: '/login', name: 'Login Page' },
    { path: '/register', name: 'Registration Page' },
    { path: '/dashboard', name: 'Dashboard Page', requiresAuth: true },
    { path: '/news', name: 'News Feed Page', requiresAuth: true },
    { path: '/profile', name: 'User Profile Page', requiresAuth: true },
    { path: '/settings', name: 'Settings Page', requiresAuth: true },
  ],
  axeConfig: {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice', 'cat.keyboard'],
    },
  },
  outputDir: './accessibility-reports',
  loginCredentials: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123',
  },
};

// Track overall results
const overallResults = {
  totalViolations: 0,
  totalIncomplete: 0,
  totalPasses: 0,
  violationsByPage: {},
  violationsBySeverity: {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  },
  violationsByStandard: {},
  mostCommonViolations: {},
};

/**
 * Ensure the output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
}

/**
 * Run accessibility tests on a specific page
 * @param {Object} browser - Puppeteer browser instance
 * @param {Object} pageConfig - Page configuration
 * @param {boolean} isLoggedIn - Whether the user is logged in
 * @returns {Promise<Object>} - Test results
 */
async function testPage(browser, pageConfig, isLoggedIn) {
  const { path, name, requiresAuth } = pageConfig;
  
  // Skip pages that require auth if not logged in
  if (requiresAuth && !isLoggedIn) {
    console.log(`Skipping ${name} (${path}) - requires authentication`);
    return null;
  }
  
  console.log(`Testing ${name} (${path})...`);
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the page
    await page.goto(`${config.baseUrl}${path}`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Run axe analysis
    const results = await new AxePuppeteer(page)
      .configure(config.axeConfig)
      .analyze();
    
    // Update overall statistics
    overallResults.totalViolations += results.violations.length;
    overallResults.totalIncomplete += results.incomplete.length;
    overallResults.totalPasses += results.passes.length;
    
    overallResults.violationsByPage[name] = results.violations.length;
    
    // Track violations by severity
    results.violations.forEach(violation => {
      overallResults.violationsBySeverity[violation.impact]++;
      
      // Track by standard (WCAG)
      violation.tags.forEach(tag => {
        if (tag.startsWith('wcag')) {
          overallResults.violationsByStandard[tag] = (overallResults.violationsByStandard[tag] || 0) + 1;
        }
      });
      
      // Track most common violations
      overallResults.mostCommonViolations[violation.id] = (overallResults.mostCommonViolations[violation.id] || 0) + 1;
    });
    
    // Save detailed results to a JSON file
    const outputFile = path.join(config.outputDir, `${name.toLowerCase().replace(/\s+/g, '-')}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    return results;
  } catch (error) {
    console.error(`Error testing ${name}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * Log in to the application
 * @param {Object} browser - Puppeteer browser instance
 * @returns {Promise<boolean>} - Whether login was successful
 */
async function login(browser) {
  console.log('Logging in...');
  
  const page = await browser.newPage();
  
  try {
    await page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle0' });
    
    // Fill in login form
    await page.type('input[type="email"]', config.loginCredentials.email);
    await page.type('input[type="password"]', config.loginCredentials.password);
    
    // Submit form
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
    // Check if login was successful (e.g., redirected to dashboard)
    const url = page.url();
    return url.includes('/dashboard') || url.includes('/home');
  } catch (error) {
    console.error('Login failed:', error.message);
    return false;
  } finally {
    await page.close();
  }
}

/**
 * Generate a summary report of all accessibility issues
 */
function generateSummaryReport() {
  // Sort most common violations
  const sortedViolations = Object.entries(overallResults.mostCommonViolations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Map violation IDs to descriptions (based on known axe rules)
  const violationDescriptions = {
    'color-contrast': 'Elements must have sufficient color contrast',
    'keyboard-nav': 'Elements must be accessible via keyboard',
    'aria-roles': 'ARIA roles must be used appropriately',
    'image-alt': 'Images must have alternate text',
    'link-name': 'Links must have discernible text',
    'form-field-multiple-labels': 'Form fields must not have multiple labels',
    'label': 'Form elements must have labels',
    'landmark-one-main': 'Page must contain one main landmark',
    'region': 'All content should be contained in landmarks',
    'page-has-heading-one': 'Page should contain a level-one heading',
    'html-has-lang': 'HTML element must have a lang attribute',
  };
  
  // Generate HTML report
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>News Impact Platform - Accessibility Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; color: #333; }
    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h2 { color: #2980b9; margin-top: 30px; }
    h3 { color: #3498db; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .critical { background-color: #ffeeee; }
    .serious { background-color: #fff6e6; }
    .moderate { background-color: #fffcdd; }
    .minor { background-color: #e6f4fa; }
    .summary { background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-top: 20px; }
    .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; }
    .fail { background-color: #ffdddd; color: #d63031; }
    .warning { background-color: #ffeaa7; color: #fdcb6e; }
    .pass { background-color: #ddffdd; color: #00b894; }
    .recommendations { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
    .chart { height: 200px; margin: 20px 0; display: flex; align-items: flex-end; }
    .bar { flex: 1; margin: 0 5px; background: #3498db; display: flex; justify-content: center; min-width: 40px; }
    .bar-label { transform: rotate(-90deg); color: white; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>News Impact Platform - Accessibility Report</h1>
  <p>Test run on ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>
      <strong>Total pages tested:</strong> ${Object.keys(overallResults.violationsByPage).length}<br>
      <strong>Total violations:</strong> ${overallResults.totalViolations}<br>
      <strong>Total incomplete tests:</strong> ${overallResults.totalIncomplete}<br>
      <strong>Total passed tests:</strong> ${overallResults.totalPasses}
    </p>
    
    <div class="chart">
      ${Object.entries(overallResults.violationsBySeverity).map(([severity, count]) => {
        const maxHeight = 180;
        const height = count > 0 ? Math.max(40, (count / Math.max(...Object.values(overallResults.violationsBySeverity))) * maxHeight) : 0;
        return `<div>
          <div class="bar" style="height: ${height}px">
            <span class="bar-label">${count}</span>
          </div>
          <div style="text-align: center">${severity}</div>
        </div>`;
      }).join('')}
    </div>
    
    <h3>Compliance Status</h3>
    <p>
      <span class="status ${overallResults.violationsBySeverity.critical > 0 ? 'fail' : 'pass'}">
        WCAG 2.1 A: ${overallResults.violationsBySeverity.critical > 0 ? 'Fails' : 'Passes'}
      </span><br>
      <span class="status ${overallResults.violationsBySeverity.serious > 0 ? 'fail' : 'pass'}">
        WCAG 2.1 AA: ${(overallResults.violationsBySeverity.critical + overallResults.violationsBySeverity.serious) > 0 ? 'Fails' : 'Passes'}
      </span><br>
    </p>
  </div>
  
  <h2>Violations by Page</h2>
  <table>
    <tr>
      <th>Page</th>
      <th>Violations</th>
      <th>Status</th>
    </tr>
    ${Object.entries(overallResults.violationsByPage).map(([page, count]) => `
      <tr>
        <td>${page}</td>
        <td>${count}</td>
        <td>
          <span class="status ${count > 0 ? 'fail' : 'pass'}">
            ${count > 0 ? 'Fail' : 'Pass'}
          </span>
        </td>
      </tr>
    `).join('')}
  </table>
  
  <h2>Top Accessibility Issues</h2>
  <table>
    <tr>
      <th>Issue</th>
      <th>Count</th>
      <th>Description</th>
    </tr>
    ${sortedViolations.map(([id, count]) => `
      <tr>
        <td>${id}</td>
        <td>${count}</td>
        <td>${violationDescriptions[id] || 'See detailed report'}</td>
      </tr>
    `).join('')}
  </table>
  
  <div class="recommendations">
    <h2>Recommendations</h2>
    <ol>
      ${sortedViolations.slice(0, 5).map(([id]) => {
        const recommendations = {
          'color-contrast': 'Ensure text has sufficient contrast with its background (minimum ratio of 4.5:1 for normal text and 3:1 for large text).',
          'keyboard-nav': 'Make sure all interactive elements are keyboard accessible and have visible focus states.',
          'aria-roles': 'Verify that ARIA roles are used correctly and match the element\'s purpose.',
          'image-alt': 'Add descriptive alt text to all images that convey information.',
          'link-name': 'Ensure all links have descriptive text that indicates their purpose.',
          'form-field-multiple-labels': 'Remove duplicate labels from form fields and ensure each field has exactly one label.',
          'label': 'Add proper labels to all form elements.',
          'landmark-one-main': 'Add a main landmark to define the primary content area of the page.',
          'region': 'Place all content within appropriate landmark regions.',
          'page-has-heading-one': 'Add a level-one heading (h1) to the page to describe its main content.',
          'html-has-lang': 'Add a lang attribute to the HTML element to specify the page language.',
        };
        return `<li>${recommendations[id] || 'Fix the identified issue according to WCAG guidelines.'}</li>`;
      }).join('')}
      <li>Run a manual keyboard navigation test on all pages.</li>
      <li>Test with screen readers such as NVDA, JAWS, or VoiceOver.</li>
      <li>Consider adding an accessibility statement to the website.</li>
    </ol>
  </div>
  
  <h2>Next Steps</h2>
  <p>The detailed reports for each page are available in the <code>${config.outputDir}</code> directory. These reports should be used to fix the identified issues in order of severity (critical, serious, moderate, minor).</p>
  
  <footer>
    <p>Generated using axe-core. See <a href="https://dequeuniversity.com/rules/axe/4.2">Deque University</a> for more information about accessibility rules.</p>
  </footer>
</body>
</html>`;
  
  fs.writeFileSync(path.join(config.outputDir, 'summary.html'), html);
  console.log(`Summary report generated: ${path.join(config.outputDir, 'summary.html')}`);
}

/**
 * Run the accessibility tests
 */
async function runAccessibilityTests() {
  console.log('Starting accessibility tests...');
  ensureOutputDir();
  
  const browser = await puppeteer.launch({ headless: true });
  try {
    // Try to log in for protected pages
    const isLoggedIn = await login(browser);
    if (isLoggedIn) {
      console.log('Login successful');
    } else {
      console.warn('Login failed, will only test public pages');
    }
    
    // Test each page
    for (const pageConfig of config.pages) {
      await testPage(browser, pageConfig, isLoggedIn);
    }
    
    // Generate summary report
    generateSummaryReport();
    
  } catch (error) {
    console.error('Error running accessibility tests:', error);
  } finally {
    await browser.close();
  }
  
  console.log('Accessibility testing complete!');
}

// Run the tests
runAccessibilityTests(); 