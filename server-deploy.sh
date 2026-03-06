#!/bin/bash
# Server Deployment Script
# Run this on the server after git push completes

echo "🚀 Starting deployment..."

# Navigate to application directory (UPDATE THIS PATH!)
cd /var/www/aigle-royale || cd /home/deploy/aigle-royale || {
    echo "❌ Error: Application directory not found"
    echo "Please update the path in this script"
    exit 1
}

echo "📍 Current directory: $(pwd)"

# Pull latest changes
echo "⬇️  Pulling latest changes from Git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npm run db:generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build application
echo "🏗️  Building Next.js application..."
npm run build

# Restart PM2
echo "🔄 Restarting application with PM2..."
pm2 reload ecosystem.config.js --update-env

# Wait a moment
sleep 3

# Check status
echo "✅ Checking application status..."
pm2 status

echo ""
echo "🎉 Deployment complete!"
echo "📊 View logs with: pm2 logs aigle-royale"
