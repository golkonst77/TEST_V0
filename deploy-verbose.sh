#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}VERBOSE DEPLOYMENT PROCESS${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# Configuration
PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"
APP_NAME="prostoburo"

# Record start time
START_TIME=$(date +%s)

# Navigate to project directory
cd "$PROJECT_PATH"

echo -e "${YELLOW}[INFO]${NC} Project directory: $(pwd)"
echo -e "${YELLOW}[INFO]${NC} Current user: $(whoami)"
echo -e "${YELLOW}[INFO]${NC} Node.js version: $(node --version)"
echo -e "${YELLOW}[INFO]${NC} NPM version: $(npm --version)"
echo

# Pull latest changes with verbose output
echo -e "${BLUE}[STEP 1]${NC} Pulling latest changes..."
git pull origin main --verbose
echo

# Install dependencies with verbose output
echo -e "${BLUE}[STEP 2]${NC} Installing dependencies..."
echo -e "${YELLOW}[INFO]${NC} Running: npm install --production --verbose"
npm install --production --verbose
echo

# Build with maximum verbosity
echo -e "${BLUE}[STEP 3]${NC} Building project..."
echo -e "${YELLOW}[INFO]${NC} Running: npm run build"
echo -e "${YELLOW}[INFO]${NC} This will show detailed build progress..."

# Set Next.js to verbose mode
export NEXT_TELEMETRY_DEBUG=1
export DEBUG=*

# Run build with full output
npm run build
echo

# Restart PM2
echo -e "${BLUE}[STEP 4]${NC} Restarting application..."
pm2 restart $APP_NAME --update-env
pm2 save
echo

# Show final status
echo -e "${GREEN}[SUCCESS]${NC} Deployment completed!"
pm2 status
echo

# Calculate time
END_TIME=$(date +%s)
DEPLOYMENT_TIME=$((END_TIME - START_TIME))
MINUTES=$((DEPLOYMENT_TIME / 60))
SECONDS=$((DEPLOYMENT_TIME % 60))

echo -e "${PURPLE}[SYSTEM]${NC} Total deployment time: ${MINUTES}m ${SECONDS}s"
echo -e "${PURPLE}[SYSTEM]${NC} Deployment completed at: $(date)"
