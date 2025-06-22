#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Ubuntu VPS Setup Script${NC}"
echo -e "${BLUE}  For Bole-PDS Application${NC}"
echo -e "${BLUE}================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run this script as root (use sudo)${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install essential packages
echo -e "${YELLOW}Installing essential packages...${NC}"
apt install -y curl wget git ufw nginx software-properties-common

# Install Node.js 18.x
echo -e "${YELLOW}Installing Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo -e "${YELLOW}Installing PM2...${NC}"
npm install -g pm2

# Create deploy user
echo -e "${YELLOW}Creating deploy user...${NC}"
if id "deploy" &>/dev/null; then
    echo -e "${YELLOW}User 'deploy' already exists${NC}"
else
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    echo -e "${GREEN}User 'deploy' created successfully${NC}"
fi

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Start and enable Nginx
echo -e "${YELLOW}Starting Nginx...${NC}"
systemctl start nginx
systemctl enable nginx

# Create project directory
echo -e "${YELLOW}Creating project directory...${NC}"
mkdir -p /home/deploy
chown deploy:deploy /home/deploy

# Install Certbot for SSL (optional)
echo -e "${YELLOW}Installing Certbot for SSL certificates...${NC}"
apt install -y certbot python3-certbot-nginx

# Install unattended upgrades
echo -e "${YELLOW}Installing automatic security updates...${NC}"
apt install -y unattended-upgrades

# Configure unattended upgrades
cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};
Unattended-Upgrade::Package-Blacklist {};
Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

# Set up log rotation for PM2
echo -e "${YELLOW}Setting up PM2 log rotation...${NC}"
pm2 install pm2-logrotate

# Display installation summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Completed Successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "${BLUE}Installed packages:${NC}"
echo -e "  - Node.js $(node --version)"
echo -e "  - npm $(npm --version)"
echo -e "  - PM2 $(pm2 --version)"
echo -e "  - Nginx"
echo -e "  - UFW Firewall"
echo -e "  - Certbot"
echo -e "  - Unattended Upgrades"
echo -e ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Switch to deploy user: ${YELLOW}su - deploy${NC}"
echo -e "  2. Clone your repository: ${YELLOW}git clone <your-repo-url>${NC}"
echo -e "  3. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
echo -e ""
echo -e "${BLUE}Firewall status:${NC}"
ufw status
echo -e ""
echo -e "${GREEN}Setup completed!${NC}" 