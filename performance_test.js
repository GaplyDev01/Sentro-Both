/**
 * News Impact Platform - Performance Testing Script
 * 
 * This script runs performance tests on the application to measure:
 * - Page load times
 * - API response times
 * - Resource usage
 */

const axios = require('axios');
const fs = require('fs');
const { performance } = require('perf_hooks');
const { spawn } = require('child_process');

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
  iterations: 5, // How many times to run each test for averaging
  pages: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/news',
    '/profile',
    '/settings',
  ],
  apiEndpoints: [
    { method: 'GET', path: '/news', auth: true },
    { method: 'GET', path: '/users/profile', auth: true },
    { method: 'GET', path: '/news/1', auth: true },
  ],
  authToken: process.env.AUTH_TOKEN || '', // Token for authenticated requests
};

// Results storage
const results = {
  pageLoadTimes: {},
  apiResponseTimes: {},
  resourceUsage: {}
};

/**
 * Measure page load time using puppeteer
 * @param {string} url - URL to measure
 * @returns {Promise<number>} - Load time in ms
 */
async function measurePageLoadTime(url) {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Setup performance metrics
    await page.setCacheEnabled(false);
    
    const start = performance.now();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const loadTime = performance.now() - start;
    
    await browser.close();
    return loadTime;
  } catch (error) {
    console.error(`Error measuring page load time for ${url}:`, error.message);
    return -1;
  }
}

/**
 * Measure API response time
 * @param {Object} endpoint - API endpoint config
 * @returns {Promise<number>} - Response time in ms
 */
async function measureApiResponseTime(endpoint) {
  try {
    const url = `${config.apiBaseUrl}${endpoint.path}`;
    const headers = endpoint.auth ? { Authorization: `Bearer ${config.authToken}` } : {};
    
    const start = performance.now();
    await axios({
      method: endpoint.method,
      url,
      headers,
      timeout: 10000
    });
    const responseTime = performance.now() - start;
    
    return responseTime;
  } catch (error) {
    console.error(`Error measuring API response time for ${endpoint.path}:`, error.message);
    return -1;
  }
}

/**
 * Run lighthouse test for performance metrics
 * @param {string} url - URL to test
 * @returns {Promise<Object>} - Lighthouse results
 */
async function runLighthouseTest(url) {
  return new Promise((resolve, reject) => {
    const lighthouseProcess = spawn('npx', [
      'lighthouse',
      url,
      '--quiet',
      '--chrome-flags="--headless"',
      '--output=json',
      '--output-path=stdout'
    ]);
    
    let output = '';
    lighthouseProcess.stdout.on('data', (data) => {
      output += data;
    });
    
    lighthouseProcess.stderr.on('data', (data) => {
      console.error(`Lighthouse error: ${data}`);
    });
    
    lighthouseProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Lighthouse output: ${error.message}`));
        }
      } else {
        reject(new Error(`Lighthouse exited with code ${code}`));
      }
    });
  });
}

/**
 * Format milliseconds to a readable format
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted time string
 */
function formatTime(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Run all performance tests
 */
async function runPerformanceTests() {
  console.log('Starting performance tests...');
  
  // Test page load times
  console.log('\nTesting page load times...');
  for (const page of config.pages) {
    const url = `${config.baseUrl}${page}`;
    console.log(`  Testing ${url}...`);
    
    const times = [];
    for (let i = 0; i < config.iterations; i++) {
      const loadTime = await measurePageLoadTime(url);
      if (loadTime > 0) times.push(loadTime);
    }
    
    if (times.length > 0) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      results.pageLoadTimes[page] = avgTime;
      console.log(`    Average load time: ${formatTime(avgTime)}`);
    } else {
      results.pageLoadTimes[page] = -1;
      console.log('    Failed to measure load time');
    }
  }
  
  // Test API response times
  console.log('\nTesting API response times...');
  for (const endpoint of config.apiEndpoints) {
    console.log(`  Testing ${endpoint.method} ${endpoint.path}...`);
    
    const times = [];
    for (let i = 0; i < config.iterations; i++) {
      const responseTime = await measureApiResponseTime(endpoint);
      if (responseTime > 0) times.push(responseTime);
    }
    
    if (times.length > 0) {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      results.apiResponseTimes[`${endpoint.method} ${endpoint.path}`] = avgTime;
      console.log(`    Average response time: ${formatTime(avgTime)}`);
    } else {
      results.apiResponseTimes[`${endpoint.method} ${endpoint.path}`] = -1;
      console.log('    Failed to measure response time');
    }
  }
  
  // Run Lighthouse tests for the main page
  try {
    console.log('\nRunning Lighthouse performance test...');
    const lighthouseResult = await runLighthouseTest(config.baseUrl);
    
    results.resourceUsage = {
      performanceScore: lighthouseResult.categories.performance.score * 100,
      firstContentfulPaint: lighthouseResult.audits['first-contentful-paint'].numericValue,
      timeToInteractive: lighthouseResult.audits['interactive'].numericValue,
      speedIndex: lighthouseResult.audits['speed-index'].numericValue,
      totalBlockingTime: lighthouseResult.audits['total-blocking-time'].numericValue,
      largestContentfulPaint: lighthouseResult.audits['largest-contentful-paint'].numericValue,
      cumulativeLayoutShift: lighthouseResult.audits['cumulative-layout-shift'].numericValue,
    };
    
    console.log(`  Performance Score: ${results.resourceUsage.performanceScore.toFixed(0)}%`);
    console.log(`  First Contentful Paint: ${formatTime(results.resourceUsage.firstContentfulPaint)}`);
    console.log(`  Time to Interactive: ${formatTime(results.resourceUsage.timeToInteractive)}`);
    console.log(`  Speed Index: ${formatTime(results.resourceUsage.speedIndex)}`);
  } catch (error) {
    console.error('Error running Lighthouse test:', error.message);
  }
  
  // Generate report
  generateReport(results);
}

/**
 * Generate HTML performance report
 * @param {Object} results - Test results
 */
function generateReport(results) {
  const reportPath = 'performance-report.html';
  
  const pageLoadData = Object.entries(results.pageLoadTimes)
    .map(([page, time]) => `<tr><td>${page}</td><td>${time > 0 ? formatTime(time) : 'Failed'}</td></tr>`)
    .join('');
  
  const apiResponseData = Object.entries(results.apiResponseTimes)
    .map(([endpoint, time]) => `<tr><td>${endpoint}</td><td>${time > 0 ? formatTime(time) : 'Failed'}</td></tr>`)
    .join('');
  
  let resourceUsageData = '<tr><td colspan="2">No data available</td></tr>';
  if (Object.keys(results.resourceUsage).length > 0) {
    resourceUsageData = Object.entries(results.resourceUsage)
      .map(([metric, value]) => {
        if (metric === 'performanceScore') {
          return `<tr><td>${formatMetricName(metric)}</td><td>${value.toFixed(0)}%</td></tr>`;
        } else {
          return `<tr><td>${formatMetricName(metric)}</td><td>${formatTime(value)}</td></tr>`;
        }
      })
      .join('');
  }
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>News Impact Platform - Performance Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; color: #333; }
    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h2 { color: #2980b9; margin-top: 30px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .summary { background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-top: 20px; }
    .pass { color: green; }
    .fail { color: red; }
    .warning { color: orange; }
  </style>
</head>
<body>
  <h1>News Impact Platform - Performance Report</h1>
  <p>Test run on ${new Date().toLocaleString()}</p>
  
  <h2>Page Load Times</h2>
  <table>
    <tr>
      <th>Page</th>
      <th>Average Load Time</th>
    </tr>
    ${pageLoadData}
  </table>
  
  <h2>API Response Times</h2>
  <table>
    <tr>
      <th>Endpoint</th>
      <th>Average Response Time</th>
    </tr>
    ${apiResponseData}
  </table>
  
  <h2>Resource Usage & Lighthouse Metrics</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    ${resourceUsageData}
  </table>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Based on the performance test results:</p>
    <ul>
      ${getSummaryItems(results)}
    </ul>
  </div>
</body>
</html>`;
  
  fs.writeFileSync(reportPath, html);
  console.log(`\nPerformance report generated: ${reportPath}`);
}

/**
 * Generate summary items based on test results
 * @param {Object} results - Test results
 * @returns {string} - HTML list items
 */
function getSummaryItems(results) {
  const items = [];
  
  // Check page load times
  const pageLoadTimes = Object.values(results.pageLoadTimes).filter(time => time > 0);
  if (pageLoadTimes.length > 0) {
    const avgPageLoad = pageLoadTimes.reduce((sum, time) => sum + time, 0) / pageLoadTimes.length;
    if (avgPageLoad < 2000) {
      items.push(`<li class="pass">Average page load time is excellent: ${formatTime(avgPageLoad)}</li>`);
    } else if (avgPageLoad < 4000) {
      items.push(`<li class="warning">Average page load time is acceptable but could be improved: ${formatTime(avgPageLoad)}</li>`);
    } else {
      items.push(`<li class="fail">Average page load time is too slow: ${formatTime(avgPageLoad)}</li>`);
    }
  }
  
  // Check API response times
  const apiResponseTimes = Object.values(results.apiResponseTimes).filter(time => time > 0);
  if (apiResponseTimes.length > 0) {
    const avgApiResponse = apiResponseTimes.reduce((sum, time) => sum + time, 0) / apiResponseTimes.length;
    if (avgApiResponse < 300) {
      items.push(`<li class="pass">Average API response time is excellent: ${formatTime(avgApiResponse)}</li>`);
    } else if (avgApiResponse < 1000) {
      items.push(`<li class="warning">Average API response time is acceptable but could be improved: ${formatTime(avgApiResponse)}</li>`);
    } else {
      items.push(`<li class="fail">Average API response time is too slow: ${formatTime(avgApiResponse)}</li>`);
    }
  }
  
  // Check Lighthouse score
  if (results.resourceUsage.performanceScore) {
    const score = results.resourceUsage.performanceScore;
    if (score >= 90) {
      items.push(`<li class="pass">Lighthouse performance score is excellent: ${score.toFixed(0)}%</li>`);
    } else if (score >= 70) {
      items.push(`<li class="warning">Lighthouse performance score is acceptable but could be improved: ${score.toFixed(0)}%</li>`);
    } else {
      items.push(`<li class="fail">Lighthouse performance score is poor: ${score.toFixed(0)}%</li>`);
    }
  }
  
  // Add recommendations if performance is poor
  if (items.some(item => item.includes('class="fail"'))) {
    items.push('<li>Recommendations for improvement:<ul>');
    items.push('<li>Optimize image sizes and formats</li>');
    items.push('<li>Enable server-side caching</li>');
    items.push('<li>Use code splitting to reduce bundle size</li>');
    items.push('<li>Implement lazy loading for images and components</li>');
    items.push('<li>Minimize third-party JavaScript</li>');
    items.push('</ul></li>');
  }
  
  return items.join('\n      ');
}

/**
 * Format metric name to be more readable
 * @param {string} name - Metric name
 * @returns {string} - Formatted name
 */
function formatMetricName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/^./, str => str.toUpperCase());
}

// Run the tests
runPerformanceTests().catch(error => {
  console.error('Error running performance tests:', error);
}); 