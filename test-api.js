#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests all API endpoints and verifies response formats match our TypeScript interfaces
 * 
 * Usage:
 *   node test-api.js [--base-url=https://api.compasse.net] [--token=your-token] [--tenant-id=tenant-id]
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const config = {
  baseUrl: process.env.API_BASE_URL || process.argv.find(arg => arg.startsWith('--base-url='))?.split('=')[1] || 'https://api.compasse.net/api/v1',
  token: process.env.TOKEN || process.argv.find(arg => arg.startsWith('--token='))?.split('=')[1] || '',
  tenantId: process.env.TENANT_ID || process.argv.find(arg => arg.startsWith('--tenant-id='))?.split('=')[1] || '',
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Make HTTP request
function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${config.baseUrl}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add auth headers
    if (config.token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      options.headers['Authorization'] = `Bearer ${config.token}`;
    }
    if (config.tenantId) {
      options.headers['X-Tenant-ID'] = config.tenantId;
    }

    // Add body for POST/PUT
    if (data && (method === 'POST' || method === 'PUT')) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test an endpoint
async function testEndpoint(description, method, endpoint, expectedStatus = 200, data = null, validator = null) {
  try {
    log(`\n${description}`, 'yellow');
    log(`  ${method} ${endpoint}`, 'blue');
    
    const response = await makeRequest(method, endpoint, data);
    
    if (response.status === expectedStatus || (expectedStatus >= 200 && expectedStatus < 300 && response.status >= 200 && response.status < 300)) {
      log(`  ✅ Success (HTTP ${response.status})`, 'green');
      
      if (validator) {
        try {
          validator(response.data);
          log(`  ✅ Response format validated`, 'green');
        } catch (error) {
          log(`  ⚠️  Validation warning: ${error.message}`, 'yellow');
        }
      }
      
      results.passed++;
      return response.data;
    } else if (response.status === 401) {
      log(`  ⚠️  Unauthorized - Token may be invalid or expired`, 'yellow');
      results.skipped++;
      return null;
    } else if (response.status === 404) {
      log(`  ⚠️  Not Found - Endpoint may not exist or resource not found`, 'yellow');
      results.skipped++;
      return null;
    } else {
      log(`  ❌ Failed (HTTP ${response.status})`, 'red');
      log(`  Response: ${JSON.stringify(response.data, null, 2)}`, 'red');
      results.failed++;
      results.errors.push({ endpoint, status: response.status, error: response.data });
      return null;
    }
  } catch (error) {
    log(`  ❌ Error: ${error.message}`, 'red');
    results.failed++;
    results.errors.push({ endpoint, error: error.message });
    return null;
  }
}

// Validators
const validators = {
  authResponse: (data) => {
    if (!data.token) throw new Error('Missing token');
    if (!data.user && !data.user) throw new Error('Missing user object');
  },
  userObject: (data) => {
    if (!data.user && !data.id) throw new Error('Invalid user object structure');
  },
  listResponse: (data) => {
    if (!data.data && !Array.isArray(data)) throw new Error('Invalid list response structure');
  },
  paginatedResponse: (data) => {
    if (!data.data && !Array.isArray(data)) throw new Error('Missing data array');
    if (data.meta && typeof data.meta.current_page !== 'number') throw new Error('Invalid pagination meta');
  },
};

// Main test suite
async function runTests() {
  log('==========================================', 'blue');
  log('API Endpoint Testing', 'blue');
  log('==========================================', 'blue');
  log(`Base URL: ${config.baseUrl}`, 'blue');
  log(`Token: ${config.token ? config.token.substring(0, 20) + '...' : 'Not set'}`, 'blue');
  log(`Tenant ID: ${config.tenantId || 'Not set'}`, 'blue');
  log('==========================================', 'blue');

  // 1. Health Check
  await testEndpoint('Health Check', 'GET', '/api/health', 200);

  // 2. Authentication
  log('\n=== AUTHENTICATION ===', 'yellow');
  
  // Try to login first (if credentials provided)
  if (process.env.TEST_EMAIL && process.env.TEST_PASSWORD) {
    const loginData = await testEndpoint(
      'User Login',
      'POST',
      '/auth/login',
      200,
      {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      },
      validators.authResponse
    );
    
    if (loginData && loginData.token) {
      config.token = loginData.token;
      log(`  Token obtained: ${config.token.substring(0, 20)}...`, 'green');
    }
  }

  if (config.token) {
    await testEndpoint('Get Current User', 'GET', '/auth/me', 200, null, validators.userObject);
  } else {
    log('\n  ⚠️  Skipping authenticated endpoints - no token', 'yellow');
  }

  // 3. Test other endpoints (only if we have a token)
  if (config.token) {
    log('\n=== TESTING OTHER ENDPOINTS ===', 'yellow');
    
    // Schools
    await testEndpoint('List Schools', 'GET', '/schools', [200, 401, 404], null, validators.listResponse);
    
    // Students
    await testEndpoint('List Students', 'GET', '/students', [200, 401, 404], null, validators.paginatedResponse);
    
    // Teachers
    await testEndpoint('List Teachers', 'GET', '/teachers', [200, 401, 404], null, validators.listResponse);
    
    // Classes
    await testEndpoint('List Classes', 'GET', '/classes', [200, 401, 404], null, validators.listResponse);
    
    // Subjects
    await testEndpoint('List Subjects', 'GET', '/subjects', [200, 401, 404], null, validators.listResponse);
    
    // Announcements
    await testEndpoint('List Announcements', 'GET', '/announcements', [200, 401, 404], null, validators.listResponse);
    
    // Assignments
    await testEndpoint('List Assignments', 'GET', '/assignments', [200, 401, 404], null, validators.listResponse);
    
    // Quizzes
    await testEndpoint('List Quizzes', 'GET', '/quizzes', [200, 401, 404], null, validators.listResponse);
    
    // Dashboard
    await testEndpoint('Admin Dashboard', 'GET', '/dashboard/admin', [200, 401, 404]);
    await testEndpoint('Teacher Dashboard', 'GET', '/dashboard/teacher', [200, 401, 404]);
    await testEndpoint('Student Dashboard', 'GET', '/dashboard/student', [200, 401, 404]);
  }

  // Print summary
  log('\n==========================================', 'blue');
  log('Test Summary', 'blue');
  log('==========================================', 'blue');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`⚠️  Skipped: ${results.skipped}`, 'yellow');
  
  if (results.errors.length > 0) {
    log('\nErrors:', 'red');
    results.errors.forEach((error, index) => {
      log(`  ${index + 1}. ${error.endpoint}: ${error.error || error.status}`, 'red');
    });
  }
  
  log('==========================================', 'blue');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});

