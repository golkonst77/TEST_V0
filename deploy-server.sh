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

# Function to show progress
show_progress() {
    local pid=$1
    local message=$2
    local dots=""
    
    while kill -0 $pid 2>/dev/null; do
        dots="${dots}."
        if [ ${#dots} -gt 3 ]; then
            dots=""
        fi
        printf "\r${YELLOW}[INFO]${NC} $message$dots   "
        sleep 1
    done
    printf "\r${GREEN}[SUCCESS]${NC} $message completed\n"
}

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}Starting deployment process...${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# Record start time
START_TIME=$(date +%s)
echo -e "${PURPLE}[SYSTEM]${NC} Deployment started at: $(date)"
echo -e "${PURPLE}[SYSTEM]${NC} Server: $(hostname)"
echo -e "${PURPLE}[SYSTEM]${NC} OS: $(uname -a)"
echo -e "${PURPLE}[SYSTEM]${NC} Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
echo -e "${PURPLE}[SYSTEM]${NC} Disk space: $(df -h . | tail -1 | awk '{print $4 " available"}')"
echo

# Configuration
PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"
APP_NAME="prostoburo"

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
echo -e "${YELLOW}[INFO]${NC} Fetching latest changes from GitHub..."

# Show current commit before pull
CURRENT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
echo -e "${YELLOW}[INFO]${NC} Current commit: $CURRENT_COMMIT"

if git pull origin main 2>&1 | tee git-pull.log; then
    echo -e "${GREEN}[SUCCESS]${NC} Git pull completed"
    
    # Show new commit
    NEW_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    echo -e "${YELLOW}[INFO]${NC} New commit: $NEW_COMMIT"
    
    # Show changed files
    CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | wc -l || echo "0")
    echo -e "${YELLOW}[INFO]${NC} Changed files: $CHANGED_FILES"
    
    if [ "$CHANGED_FILES" -gt 0 ]; then
        echo -e "${YELLOW}[INFO]${NC} Recent changes:"
        git diff --name-only HEAD~1 HEAD 2>/dev/null | head -5 | sed 's/^/  - /'
        if [ "$CHANGED_FILES" -gt 5 ]; then
            echo -e "${YELLOW}[INFO]${NC}  ... and $((CHANGED_FILES - 5)) more files"
        fi
    fi
else
    echo -e "${YELLOW}[WARNING]${NC} Git pull failed, continuing with current files..."
    echo -e "${YELLOW}[INFO]${NC} Git pull log saved to git-pull.log"
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

# Show current version
if [ -f "package.json" ]; then
    CURRENT_VERSION=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')
    echo -e "${YELLOW}[INFO]${NC} Current version: $CURRENT_VERSION"
fi

echo -e "${YELLOW}[INFO]${NC} Node.js version: $(node --version)"
echo -e "${YELLOW}[INFO]${NC} NPM version: $(npm --version)"
echo

# Install dependencies
echo -e "${BLUE}[STEP 2]${NC} Installing dependencies..."
echo -e "${YELLOW}[INFO]${NC} Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "${YELLOW}[INFO]${NC} Package.json found, reading dependencies..."
    DEPENDENCIES=$(grep -c '"dependencies"' package.json || echo "0")
    DEV_DEPENDENCIES=$(grep -c '"devDependencies"' package.json || echo "0")
    echo -e "${YELLOW}[INFO]${NC} Dependencies: $DEPENDENCIES, Dev dependencies: $DEV_DEPENDENCIES"
fi

echo -e "${YELLOW}[INFO]${NC} Installing dependencies (this may take a few minutes)..."
if npm install --production 2>&1 | tee install.log; then
    echo -e "${GREEN}[SUCCESS]${NC} Dependencies installed"
    echo -e "${YELLOW}[INFO]${NC} Install log saved to install.log"
    
    # Show package count
    if [ -d "node_modules" ]; then
        PACKAGE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo -e "${YELLOW}[INFO]${NC} Installed packages: $((PACKAGE_COUNT - 1))"
    fi
else
    echo -e "${RED}[ERROR]${NC} Failed to install dependencies"
    echo -e "${YELLOW}[INFO]${NC} Install log saved to install.log"
    echo -e "${YELLOW}[INFO]${NC} Last 20 lines of install log:"
    tail -20 install.log
    exit 1
fi
echo

# Build project
echo -e "${BLUE}[STEP 3]${NC} Building project..."
echo -e "${YELLOW}[INFO]${NC} Starting Next.js build process..."
echo -e "${YELLOW}[INFO]${NC} This may take several minutes for the first build..."

# Set Next.js to verbose mode for better logging
export NEXT_TELEMETRY_DEBUG=1

# Run build with verbose output
echo -e "${YELLOW}[INFO]${NC} Build command: npm run build"
echo -e "${YELLOW}[INFO]${NC} Next.js telemetry debug enabled"
if npm run build 2>&1 | tee build.log; then
    echo -e "${GREEN}[SUCCESS]${NC} Project built successfully"
    echo -e "${YELLOW}[INFO]${NC} Build log saved to build.log"
    
    # Show build summary
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo -e "${YELLOW}[INFO]${NC} Build ID: $BUILD_ID"
    fi
    
    # Show build size
    if [ -d ".next/static" ]; then
        STATIC_SIZE=$(du -sh .next/static | cut -f1)
        echo -e "${YELLOW}[INFO]${NC} Static assets size: $STATIC_SIZE"
    fi
else
    echo -e "${RED}[ERROR]${NC} Build failed"
    echo -e "${YELLOW}[INFO]${NC} Build log saved to build.log"
    echo -e "${YELLOW}[INFO]${NC} Last 20 lines of build log:"
    tail -20 build.log
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

# Calculate deployment time
END_TIME=$(date +%s)
DEPLOYMENT_TIME=$((END_TIME - START_TIME))
MINUTES=$((DEPLOYMENT_TIME / 60))
SECONDS=$((DEPLOYMENT_TIME % 60))

echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo
echo -e "${PURPLE}[SYSTEM]${NC} Deployment completed at: $(date)"
echo -e "${PURPLE}[SYSTEM]${NC} Total deployment time: ${MINUTES}m ${SECONDS}s"
echo -e "${YELLOW}[INFO]${NC} Application name: $APP_NAME"
echo -e "${YELLOW}[INFO]${NC} Project path: $PROJECT_PATH"
echo -e "${YELLOW}[INFO]${NC} Website: https://prostoburo.com"

# Show deployed version
if [ -f "package.json" ]; then
    DEPLOYED_VERSION=$(grep '"version"' package.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')
    echo -e "${YELLOW}[INFO]${NC} Deployed version: $DEPLOYED_VERSION"
fi
echo

# Show system resources after deployment
echo -e "${CYAN}[RESOURCES]${NC} System status after deployment:"
echo -e "${CYAN}[RESOURCES]${NC} Memory usage: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2 " (" int($3/$2*100) "%)"}')"
echo -e "${CYAN}[RESOURCES]${NC} Disk usage: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
echo -e "${CYAN}[RESOURCES]${NC} Load average: $(uptime | awk -F'load average:' '{print $2}')"
echo

echo -e "${BLUE}Useful commands:${NC}"
echo -e "  pm2 status          - Check application status"
echo -e "  pm2 logs $APP_NAME   - View application logs"
echo -e "  pm2 restart $APP_NAME - Restart application"
echo -e "  pm2 stop $APP_NAME    - Stop application"
echo -e "  tail -f build.log   - View build log"
echo -e "  tail -f install.log - View install log"
echo
