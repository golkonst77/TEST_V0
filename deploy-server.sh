#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}Starting deployment process...${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# Configuration
PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"
APP_NAME="my-next-app"

echo -e "${YELLOW}[INFO]${NC} Current directory: $(pwd)"
echo -e "${YELLOW}[INFO]${NC} User: $(whoami)"
echo -e "${YELLOW}[INFO]${NC} Date: $(date)"
echo -e "${YELLOW}[INFO]${NC} Project path: $PROJECT_PATH"
echo

# Check if project directory exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}[ERROR]${NC} Project directory not found: $PROJECT_PATH"
    echo -e "${YELLOW}[INFO]${NC} Available directories in /var/www/prostoburo_c_usr/data/www/:"
    ls -la /var/www/prostoburo_c_usr/data/www/ || echo "Directory does not exist"
    exit 1
fi

# Navigate to project directory
cd "$PROJECT_PATH"
echo -e "${GREEN}[SUCCESS]${NC} Changed to project directory: $(pwd)"
echo

# Check if it's a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Not a git repository"
    echo -e "${YELLOW}[INFO]${NC} Initializing git repository..."
    git init
    echo -e "${YELLOW}[INFO]${NC} You may need to add remote origin manually"
fi

# Pull latest changes
echo -e "${BLUE}[STEP 1]${NC} Pulling latest changes..."
if git pull origin main; then
    echo -e "${GREEN}[SUCCESS]${NC} Git pull completed"
else
    echo -e "${YELLOW}[WARNING]${NC} Git pull failed, continuing with current files..."
fi
echo

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}[ERROR]${NC} package.json not found in $(pwd)"
    echo -e "${YELLOW}[INFO]${NC} Files in current directory:"
    ls -la
    exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} package.json found"
echo -e "${YELLOW}[INFO]${NC} Node.js version: $(node --version)"
echo -e "${YELLOW}[INFO]${NC} NPM version: $(npm --version)"
echo

# Install dependencies
echo -e "${BLUE}[STEP 2]${NC} Installing dependencies..."
if npm install --production; then
    echo -e "${GREEN}[SUCCESS]${NC} Dependencies installed"
else
    echo -e "${RED}[ERROR]${NC} Failed to install dependencies"
    exit 1
fi
echo

# Build project
echo -e "${BLUE}[STEP 3]${NC} Building project..."
if npm run build; then
    echo -e "${GREEN}[SUCCESS]${NC} Project built successfully"
else
    echo -e "${RED}[ERROR]${NC} Build failed"
    exit 1
fi
echo

# Restart application with PM2
echo -e "${BLUE}[STEP 4]${NC} Managing application with PM2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} PM2 is not installed"
    echo -e "${YELLOW}[INFO]${NC} Installing PM2..."
    npm install -g pm2
fi

# Stop existing process if running
pm2 stop $APP_NAME 2>/dev/null || echo -e "${YELLOW}[INFO]${NC} No existing process to stop"

# Start or restart the application
if pm2 list | grep -q $APP_NAME; then
    echo -e "${YELLOW}[INFO]${NC} Restarting existing application..."
    pm2 restart $APP_NAME --update-env
else
    echo -e "${YELLOW}[INFO]${NC} Starting new application..."
    pm2 start npm --name $APP_NAME -- start
fi

# Save PM2 configuration
pm2 save

echo -e "${GREEN}[SUCCESS]${NC} Application managed with PM2"
echo

# Show PM2 status
echo -e "${BLUE}[STEP 5]${NC} Application status:"
pm2 status
echo

# Show application logs (last 10 lines)
echo -e "${BLUE}[STEP 6]${NC} Recent application logs:"
pm2 logs $APP_NAME --lines 10 --nostream
echo

echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo
echo -e "${YELLOW}[INFO]${NC} Application name: $APP_NAME"
echo -e "${YELLOW}[INFO]${NC} Project path: $PROJECT_PATH"
echo -e "${YELLOW}[INFO]${NC} Deployment time: $(date)"
echo -e "${YELLOW}[INFO]${NC} Website: https://prostoburo.com"
echo
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  pm2 status          - Check application status"
echo -e "  pm2 logs $APP_NAME   - View application logs"
echo -e "  pm2 restart $APP_NAME - Restart application"
echo -e "  pm2 stop $APP_NAME    - Stop application"
echo
