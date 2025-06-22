#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/home/deploy/backups"
PROJECT_DIR="/home/deploy/Animal-Feed"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="bole_pds_backup_$DATE.tar.gz"

echo -e "${GREEN}Starting backup process...${NC}"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo -e "${YELLOW}Creating backup archive...${NC}"
tar -czf $BACKUP_DIR/$BACKUP_NAME -C /home/deploy Animal-Feed

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create backup${NC}"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h $BACKUP_DIR/$BACKUP_NAME | cut -f1)

echo -e "${GREEN}Backup created successfully!${NC}"
echo -e "${GREEN}Backup file: $BACKUP_NAME${NC}"
echo -e "${GREEN}Backup size: $BACKUP_SIZE${NC}"
echo -e "${GREEN}Backup location: $BACKUP_DIR/$BACKUP_NAME${NC}"

# Clean up old backups (keep only last 7 days)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
find $BACKUP_DIR -name "bole_pds_backup_*.tar.gz" -mtime +7 -delete

# List remaining backups
echo -e "${YELLOW}Remaining backups:${NC}"
ls -lh $BACKUP_DIR/bole_pds_backup_*.tar.gz 2>/dev/null || echo "No backups found"

echo -e "${GREEN}Backup process completed!${NC}" 