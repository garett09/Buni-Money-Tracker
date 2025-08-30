// Simple script to set up environment variables for development
const fs = require('fs');
const path = require('path');

const envContent = `# Development Environment Variables
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-for-development-change-this-in-production

# Production Environment Variables (for Vercel deployment)
# UPSTASH_REDIS_REST_URL=your-upstash-redis-url
# UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
`;

const envPath = path.join(__dirname, 'backend', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created at backend/.env');
  console.log('📝 You can now run: npm start');
} catch (error) {
  console.log('❌ Error creating .env file:', error.message);
  console.log('📝 Please create backend/.env manually with:');
  console.log(envContent);
}
