#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}BUILD MONITOR${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

cd "$PROJECT_PATH"

# Check if build is running
if pgrep -f "npm run build" > /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} Build process is running..."
    echo -e "${YELLOW}[INFO]${NC} Process ID: $(pgrep -f 'npm run build')"
    echo
else
    echo -e "${RED}[INFO]${NC} No build process found"
    echo
fi

# Show system resources
echo -e "${BLUE}[SYSTEM]${NC} Current system status:"
echo -e "${BLUE}[SYSTEM]${NC} Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2 " (" int($3/$2*100) "%)"}')"
echo -e "${BLUE}[SYSTEM]${NC} Load: $(uptime | awk -F'load average:' '{print $2}')"
echo -e "${BLUE}[SYSTEM]${NC} Disk: $(df -h . | tail -1 | awk '{print $5 " used"}')"
echo

# Show recent build logs if they exist
if [ -f "build.log" ]; then
    echo -e "${BLUE}[BUILD LOG]${NC} Last 20 lines of build.log:"
    echo -e "${YELLOW}----------------------------------------${NC}"
    tail -20 build.log
    echo -e "${YELLOW}----------------------------------------${NC}"
    echo
fi

# Show Next.js build directory status
if [ -d ".next" ]; then
    echo -e "${BLUE}[BUILD STATUS]${NC} Next.js build directory exists"
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo -e "${BLUE}[BUILD STATUS]${NC} Build ID: $BUILD_ID"
    fi
    
    if [ -d ".next/static" ]; then
        STATIC_SIZE=$(du -sh .next/static | cut -f1)
        echo -e "${BLUE}[BUILD STATUS]${NC} Static assets: $STATIC_SIZE"
    fi
else
    echo -e "${RED}[BUILD STATUS]${NC} No .next directory found"
fi

echo
echo -e "${YELLOW}[COMMANDS]${NC} Useful monitoring commands:"
echo -e "  tail -f build.log     - Follow build log in real-time"
echo -e "  ps aux | grep npm     - Check running npm processes"
echo -e "  htop                  - Monitor system resources"
echo -e "  watch -n 5 'ls -la .next/' - Watch build directory changes"
echo
