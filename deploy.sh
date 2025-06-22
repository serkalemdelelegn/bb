#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Navigate to project directory
cd /home/bole/bb

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes from git...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to pull changes from git${NC}"
    exit 1
fi

# Install root dependencies
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install root dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build frontend${NC}"
    exit 1
fi

cd ..

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart applications
echo -e "${YELLOW}Restarting applications...${NC}"
pm2 restart all

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to restart applications${NC}"
    exit 1
fi

# Save PM2 configuration
pm2 save

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Applications are now running with the latest changes.${NC}"

# Show status
echo -e "${YELLOW}Current PM2 status:${NC}"
pm2 status 