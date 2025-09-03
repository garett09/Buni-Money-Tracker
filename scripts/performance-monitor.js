#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      buildTimes: [],
      pageLoadTimes: [],
      bundleSizes: [],
    };
    this.startTime = Date.now();
  }

  // Monitor build performance
  async monitorBuild() {
    console.log('🚀 Starting build performance monitoring...');
    
    const buildStart = Date.now();
    
    try {
      // Run build with performance measurement
      execSync('npm run build', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      
      const buildTime = Date.now() - buildStart;
      this.metrics.buildTimes.push(buildTime);
      
      console.log(`✅ Build completed in ${buildTime}ms`);
      
      // Analyze bundle size
      await this.analyzeBundleSize();
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
    }
  }

  // Analyze bundle size
  async analyzeBundleSize() {
    try {
      const bundleStats = execSync('npx @next/bundle-analyzer --json', { encoding: 'utf8' });
      const stats = JSON.parse(bundleStats);
      
      this.metrics.bundleSizes.push({
        timestamp: Date.now(),
        totalSize: stats.totalSize,
        jsSize: stats.jsSize,
        cssSize: stats.cssSize,
      });
      
      console.log(`📊 Bundle size: ${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`);
      
    } catch (error) {
      console.log('⚠️ Bundle analysis not available');
    }
  }

  // Monitor development server performance
  async monitorDevServer() {
    console.log('🔄 Starting development server performance monitoring...');
    
    const devStart = Date.now();
    
    try {
      // Start dev server in background
      const devProcess = execSync('npm run dev:fast', { 
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'development' }
      });
      
      // Wait for server to start
      await this.waitForServer();
      
      const startupTime = Date.now() - devStart;
      console.log(`✅ Dev server started in ${startupTime}ms`);
      
      // Monitor page load times
      await this.monitorPageLoads();
      
    } catch (error) {
      console.error('❌ Dev server monitoring failed:', error.message);
    }
  }

  // Wait for server to be ready
  async waitForServer() {
    return new Promise((resolve) => {
      const checkServer = () => {
        try {
          execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
          resolve();
        } catch (error) {
          setTimeout(checkServer, 1000);
        }
      };
      checkServer();
    });
  }

  // Monitor page load performance
  async monitorPageLoads() {
    const pages = [
      '/',
      '/dashboard',
      '/dashboard/income',
      '/dashboard/expenses',
      '/dashboard/transactions',
    ];

    console.log('📱 Monitoring page load performance...');

    for (const page of pages) {
      try {
        const loadStart = Date.now();
        
        // Simulate page load
        execSync(`curl -s "http://localhost:3000${page}" > /dev/null`, { stdio: 'ignore' });
        
        const loadTime = Date.now() - loadStart;
        this.metrics.pageLoadTimes.push({
          page,
          loadTime,
          timestamp: Date.now(),
        });
        
        console.log(`  ${page}: ${loadTime}ms`);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`  ${page}: Failed to load`);
      }
    }
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalRuntime: Date.now() - this.startTime,
      metrics: this.metrics,
      summary: {
        averageBuildTime: this.calculateAverage(this.metrics.buildTimes),
        averagePageLoadTime: this.calculateAverage(this.metrics.pageLoadTimes.map(m => m.loadTime)),
        totalBuilds: this.metrics.buildTimes.length,
        totalPageLoads: this.metrics.pageLoadTimes.length,
      },
      recommendations: this.generateRecommendations(),
    };

    // Save report
    const reportPath = path.join(__dirname, '../performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📋 Performance Report Generated:');
    console.log(`  📁 Location: ${reportPath}`);
    console.log(`  ⏱️  Average Build Time: ${report.summary.averageBuildTime}ms`);
    console.log(`  🚀 Average Page Load: ${report.summary.averagePageLoadTime}ms`);
    console.log(`  🔄 Total Builds: ${report.summary.totalBuilds}`);
    console.log(`  📱 Total Page Loads: ${report.summary.totalPageLoads}`);
    
    return report;
  }

  // Calculate average
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
  }

  // Generate performance recommendations
  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.buildTimes.length > 0) {
      const avgBuildTime = this.calculateAverage(this.metrics.buildTimes);
      
      if (avgBuildTime > 30000) {
        recommendations.push('Consider enabling Turbo mode for faster builds');
        recommendations.push('Review and optimize large dependencies');
        recommendations.push('Enable SWC minification for faster compilation');
      }
    }
    
    if (this.metrics.pageLoadTimes.length > 0) {
      const avgLoadTime = this.calculateAverage(this.metrics.pageLoadTimes.map(m => m.loadTime));
      
      if (avgLoadTime > 1000) {
        recommendations.push('Implement route prefetching for faster navigation');
        recommendations.push('Optimize bundle splitting and code splitting');
        recommendations.push('Enable image optimization and lazy loading');
      }
    }
    
    return recommendations;
  }

  // Run full performance monitoring
  async run() {
    console.log('🎯 Buni Money Tracker Performance Monitor');
    console.log('=====================================\n');
    
    try {
      // Monitor build performance
      await this.monitorBuild();
      
      // Monitor development server
      await this.monitorDevServer();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run();
}

module.exports = PerformanceMonitor;
