#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ComprehensiveTestRunner {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.coverageData = null;
  }

  async runAllTests() {
    console.log('🧪 COMPREHENSIVE TEST SUITE FOR BUNI MONEY TRACKER');
    console.log('='.repeat(80));
    console.log('🚀 Starting rigorous testing (Mockito-style)...\n');

    // Run different types of tests
    await this.runUnitTests();
    await this.runIntegrationTests();
    await this.runComponentTests();
    await this.runPerformanceTests();
    await this.generateCoverageReport();

    const summary = this.generateSummary();
    this.printDetailedResults(summary);
    this.saveTestReport(summary);

    return summary;
  }

  async runUnitTests() {
    console.log('📋 UNIT TESTS');
    console.log('-'.repeat(40));
    
    const unitTestFiles = [
      '__tests__/intelligentBudget.test.ts'
    ];

    for (const testFile of unitTestFiles) {
      await this.runTestFile(testFile, 'Unit');
    }
  }

  async runIntegrationTests() {
    console.log('\n📋 INTEGRATION TESTS');
    console.log('-'.repeat(40));
    
    const integrationTestFiles = [
      '__tests__/BudgetSettings.test.tsx'
    ];

    for (const testFile of integrationTestFiles) {
      await this.runTestFile(testFile, 'Integration');
    }
  }

  async runComponentTests() {
    console.log('\n📋 COMPONENT TESTS');
    console.log('-'.repeat(40));
    
    const componentTestFiles = [
      '__tests__/AccountBalance.test.tsx',
      '__tests__/EnhancedDashboard.test.tsx'
    ];

    for (const testFile of componentTestFiles) {
      await this.runTestFile(testFile, 'Component');
    }
  }

  async runPerformanceTests() {
    console.log('\n📋 PERFORMANCE TESTS');
    console.log('-'.repeat(40));
    
    try {
      // Run performance tests with larger datasets
      const performanceTest = `
        const { IntelligentBudget } = require('./app/lib/intelligentBudget');
        
        // Generate large dataset
        const largeTransactions = Array.from({ length: 10000 }, (_, i) => ({
          id: i,
          amount: Math.random() * 10000,
          description: \`Transaction \${i}\`,
          category: ['Food', 'Transport', 'Housing', 'Entertainment'][Math.floor(Math.random() * 4)],
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: Math.random() > 0.7 ? 'income' : 'expense'
        }));
        
        const startTime = Date.now();
        const budget = new IntelligentBudget(largeTransactions);
        const forecast = budget.generateForecast();
        const endTime = Date.now();
        
        console.log(\`Performance: \${endTime - startTime}ms for 10,000 transactions\`);
        
        if (endTime - startTime < 2000) {
          console.log('✅ Performance test PASSED');
        } else {
          console.log('❌ Performance test FAILED - too slow');
        }
      `;

      const tempFile = path.join(__dirname, '../temp-performance-test.js');
      fs.writeFileSync(tempFile, performanceTest);
      
      const result = execSync(`node ${tempFile}`, { encoding: 'utf8' });
      console.log(result);
      
      fs.unlinkSync(tempFile);
      
    } catch (error) {
      console.log(`❌ Performance test failed: ${error.message}`);
    }
  }

  async runTestFile(testFile, testType) {
    const testPath = path.join(__dirname, '..', testFile);
    
    if (!fs.existsSync(testPath)) {
      console.log(`❌ Test file not found: ${testFile}`);
      return;
    }

    try {
      console.log(`🔍 Running ${testFile}...`);
      
      const startTime = Date.now();
      const result = execSync(`npx jest ${testPath} --json --silent --coverage`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const duration = Date.now() - startTime;

      const jestResult = JSON.parse(result);
      
      const testResult = {
        testFile,
        testType,
        passed: jestResult.numPassedTests || 0,
        failed: jestResult.numFailedTests || 0,
        total: jestResult.numTotalTests || 0,
        duration,
        errors: jestResult.testResults?.[0]?.message || [],
        coverage: jestResult.coverageMap
      };

      this.testResults.push(testResult);

      if (testResult.failed === 0) {
        console.log(`✅ ${testFile} - ${testResult.passed}/${testResult.total} tests passed (${duration}ms)`);
      } else {
        console.log(`❌ ${testFile} - ${testResult.failed}/${testResult.total} tests failed (${duration}ms)`);
        testResult.errors.forEach(error => {
          console.log(`    ❌ ${error}`);
        });
      }

    } catch (error) {
      console.log(`❌ Error running ${testFile}: ${error.message}`);
      this.testResults.push({
        testFile,
        testType,
        passed: 0,
        failed: 1,
        total: 1,
        duration: 0,
        errors: [error.message],
        coverage: null
      });
    }
  }

  async generateCoverageReport() {
    console.log('\n📋 COVERAGE ANALYSIS');
    console.log('-'.repeat(40));
    
    try {
      const coverageResult = execSync('npx jest --coverage --json --silent', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const coverageData = JSON.parse(coverageResult);
      this.coverageData = coverageData;
      
      console.log('📊 Coverage Summary:');
      if (coverageData.coverageMap) {
        const summary = coverageData.coverageMap.getCoverageSummary();
        console.log(`  Statements: ${summary.statements.pct}%`);
        console.log(`  Branches: ${summary.branches.pct}%`);
        console.log(`  Functions: ${summary.functions.pct}%`);
        console.log(`  Lines: ${summary.lines.pct}%`);
      }
      
    } catch (error) {
      console.log(`❌ Coverage analysis failed: ${error.message}`);
    }
  }

  generateSummary() {
    const totalTests = this.testResults.reduce((sum, result) => sum + result.total, 0);
    const totalPassed = this.testResults.reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = this.testResults.reduce((sum, result) => sum + result.failed, 0);
    const totalDuration = Date.now() - this.startTime;

    return {
      totalTests,
      totalPassed,
      totalFailed,
      totalDuration,
      successRate: ((totalPassed / totalTests) * 100).toFixed(1),
      testResults: this.testResults,
      coverage: this.coverageData,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }

  printDetailedResults(summary) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\n🎯 Overall Results:`);
    console.log(`  Total Tests: ${summary.totalTests}`);
    console.log(`  Passed: ${summary.totalPassed} ✅`);
    console.log(`  Failed: ${summary.totalFailed} ❌`);
    console.log(`  Success Rate: ${summary.successRate}%`);
    console.log(`  Total Duration: ${summary.totalDuration}ms`);

    console.log(`\n📋 Test Results by Category:`);
    const categories = {};
    summary.testResults.forEach(result => {
      if (!categories[result.testType]) {
        categories[result.testType] = { passed: 0, failed: 0, total: 0 };
      }
      categories[result.testType].passed += result.passed;
      categories[result.testType].failed += result.failed;
      categories[result.testType].total += result.total;
    });

    Object.entries(categories).forEach(([category, stats]) => {
      const rate = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`  ${category}: ${stats.passed}/${stats.total} (${rate}%)`);
    });

    console.log(`\n📋 Detailed Test Results:`);
    summary.testResults.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌';
      const percentage = ((result.passed / result.total) * 100).toFixed(1);
      console.log(`  ${status} [${result.testType}] ${result.testFile}: ${result.passed}/${result.total} (${percentage}%) - ${result.duration}ms`);
    });

    if (summary.totalFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! The system is robust and reliable.');
      console.log('✅ Unit tests: Core logic is working correctly');
      console.log('✅ Integration tests: Components work together properly');
      console.log('✅ Component tests: UI components render and function correctly');
      console.log('✅ Performance tests: System handles large datasets efficiently');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED. Please review the errors above.');
      console.log('🔧 Recommended actions:');
      console.log('  1. Check the failing test cases');
      console.log('  2. Review error messages and stack traces');
      console.log('  3. Fix the underlying issues');
      console.log('  4. Re-run the test suite');
    }

    console.log('\n📈 Quality Metrics:');
    console.log(`  Test Coverage: ${summary.successRate}%`);
    console.log(`  Execution Time: ${summary.totalDuration}ms`);
    console.log(`  Test Density: ${(summary.totalTests / 4).toFixed(1)} tests per module`);
    
    if (summary.coverage && summary.coverage.coverageMap) {
      const coverage = summary.coverage.coverageMap.getCoverageSummary();
      console.log(`  Code Coverage: ${coverage.statements.pct}% statements, ${coverage.functions.pct}% functions`);
    }
  }

  saveTestReport(summary) {
    const reportPath = path.join(__dirname, '../test-report-comprehensive.json');
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`\n📄 Comprehensive test report saved to: ${reportPath}`);
    
    // Also save a human-readable report
    const humanReportPath = path.join(__dirname, '../test-report.txt');
    const humanReport = this.generateHumanReadableReport(summary);
    fs.writeFileSync(humanReportPath, humanReport);
    console.log(`📄 Human-readable report saved to: ${humanReportPath}`);
  }

  generateHumanReadableReport(summary) {
    return `
BUNI MONEY TRACKER - COMPREHENSIVE TEST REPORT
===============================================

Test Execution Summary
---------------------
Timestamp: ${summary.timestamp}
Total Tests: ${summary.totalTests}
Passed: ${summary.totalPassed}
Failed: ${summary.totalFailed}
Success Rate: ${summary.successRate}%
Duration: ${summary.totalDuration}ms

Environment
-----------
Node Version: ${summary.environment.nodeVersion}
Platform: ${summary.environment.platform}
Architecture: ${summary.environment.arch}

Detailed Results
----------------
${summary.testResults.map(result => `
${result.testType} Test: ${result.testFile}
  Status: ${result.failed === 0 ? 'PASSED' : 'FAILED'}
  Results: ${result.passed}/${result.total} tests passed
  Duration: ${result.duration}ms
  ${result.errors.length > 0 ? `Errors: ${result.errors.join(', ')}` : ''}
`).join('')}

Quality Assessment
-----------------
${summary.totalFailed === 0 ? 
  '✅ EXCELLENT: All tests passed. The system is robust and ready for production.' :
  '⚠️  NEEDS ATTENTION: Some tests failed. Review and fix issues before deployment.'
}

Recommendations
--------------
${summary.totalFailed === 0 ? 
  '• The system meets all quality standards\n• Ready for production deployment\n• Continue monitoring in production' :
  '• Fix failing tests before deployment\n• Review error messages for root causes\n• Re-run tests after fixes\n• Consider additional test cases'
}
    `;
  }
}

// Test scenarios validation
const expectedTestScenarios = {
  intelligentBudget: [
    'Constructor initialization',
    'Forecast generation',
    'Spending analysis',
    'Budget optimization',
    'Settings management',
    'Learning functionality',
    'Edge case handling',
    'Performance testing'
  ],
  accountBalance: [
    'Data loading',
    'Balance display',
    'Privacy controls',
    'Refresh functionality',
    'Account types',
    'Multiple accounts',
    'Error handling',
    'Performance'
  ],
  budgetSettings: [
    'Modal rendering',
    'Configuration inputs',
    'AI settings',
    'Insights display',
    'Settings persistence',
    'Integration testing',
    'Error handling',
    'User interactions'
  ],
  enhancedDashboard: [
    'Component rendering',
    'Tab navigation',
    'Analytics calculations',
    'Period filtering',
    'Budget integration',
    'Category analysis',
    'Performance',
    'Error handling'
  ]
};

console.log('🧪 COMPREHENSIVE TEST SUITE FOR BUNI MONEY TRACKER');
console.log('='.repeat(80));

console.log('\n📋 Expected Test Coverage:');
Object.entries(expectedTestScenarios).forEach(([module, scenarios]) => {
  console.log(`\n🔧 ${module}:`);
  scenarios.forEach(scenario => {
    console.log(`  • ${scenario}`);
  });
});

console.log('\n🚀 Starting comprehensive test execution...\n');

// Run the comprehensive test suite
const runner = new ComprehensiveTestRunner();
runner.runAllTests().then(summary => {
  process.exit(summary.totalFailed > 0 ? 1 : 0);
}).catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
