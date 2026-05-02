#!/usr/bin/env node
/**
 * Newman test runner for Student Learning Platform API
 * 
 * Usage: node newman-test.js [--headless]
 * or: npm run test:api
 */

const newman = require('newman');
const path = require('path');

const collectionPath = path.join(__dirname, 'postman_collection.json');

const options = {
  collection: collectionPath,
  reporters: ['cli', 'json'],
  reporterOptions: {
    json: {
      export: path.join(__dirname, 'test-results.json')
    }
  },
  environment: {
    values: [
      { key: 'baseUrl', value: process.env.API_URL || 'http://localhost:5000' },
      { key: 'token', value: '' },
      { key: 'recipientId', value: 'test-user-1' },
      { key: 'targetUserId', value: 'test-user-2' }
    ]
  }
};

console.log('Starting Newman API tests...');
console.log(`Collection: ${collectionPath}`);
console.log(`Base URL: ${options.environment.values[0].value}`);
console.log('');

newman.run(options, (err, summary) => {
  if (err) {
    console.error('Newman run failed:', err);
    process.exit(1);
  }

  console.log('\n--- Test Summary ---');
  console.log(`Total requests: ${summary.collection.requests.count}`);
  console.log(`Passed: ${summary.run.stats.requests.total - summary.run.stats.requests.failed}`);
  console.log(`Failed: ${summary.run.stats.requests.failed}`);
  
  if (summary.run.failures.length > 0) {
    console.log('\n--- Failures ---');
    summary.run.failures.forEach((failure) => {
      console.log(`❌ ${failure.source.name}`);
      console.log(`   Error: ${failure.error.message}`);
    });
    process.exit(1);
  } else {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  }
});
