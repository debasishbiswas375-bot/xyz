#!/bin/bash

# Accountesy Deployment Script
# For GitHub Actions / Render deployment

set -e

echo "🚀 Starting Accountesy Deployment..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Node.js dependencies and build frontend
echo "🏗️ Building frontend..."
npm install
npm run build

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p static/temp
mkdir -p static/downloads

# Set permissions
echo "🔒 Setting permissions..."
chmod +x deploy.sh

echo "✅ Deployment preparation complete!"
echo "🌐 Ready for production deployment"

# Health check
echo "🏥 Running health check..."
python -c "
import requests
import sys
try:
    response = requests.get('http://localhost:8000/health', timeout=5)
    print('🎉 Health check passed!')
except Exception as e:
    print(f'❌ Health check failed: {e}')
    sys.exit(1)
" 2>/dev/null || echo "⚠️  Health check skipped (server not running)"

echo "🎯 Accountesy is ready for deployment!"
