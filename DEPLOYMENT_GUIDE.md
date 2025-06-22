# Ubuntu VPS Deployment Guide

This guide will help you deploy your Animal Feed Bole-PDS application to an Ubuntu VPS using SSH.

## Prerequisites

- Ubuntu VPS (20.04 LTS or newer recommended)
- SSH access to your VPS
- Domain name (optional but recommended)
- Git repository with your code

## Step 1: Initial VPS Setup

### 1.1 Connect to your VPS via SSH
```bash
ssh root@your-vps-ip-address
```

### 1.2 Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Create a non-root user (recommended)
```bash
# Create a new user
adduser deploy

# Add user to sudo group
usermod -aG sudo deploy

# Switch to the new user
su - deploy
```

## Step 2: Install Required Software

### 2.1 Install Node.js and npm
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.2 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.3 Install Nginx (Web Server)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4 Install Git
```bash
sudo apt install git -y
```

### 2.5 Install UFW (Firewall)
```bash
sudo apt install ufw -y
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 3: Clone and Setup Your Application

### 3.1 Clone your repository
```bash
cd /home/deploy
git clone https://github.com/serkalemdelelegn/bole-pds1.git
cd bole-pds1
```

### 3.2 Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Step 4: Environment Configuration

### 4.1 Backend Environment Setup
```bash
cd /home/deploy/bole-pds1/backend
nano config.env
```

Update the configuration:
```env
NODE_ENV=production
DATABASE=mongodb://ferid69:ElL5UyYztvtpF08u@bole-pds-shard-00-00.plesx.mongodb.net:27017,bole-pds-shard-00-01.plesx.mongodb.net:27017,bole-pds-shard-00-02.plesx.mongodb.net:27017/bole_pds?ssl=true&replicaSet=atlas-ju33gb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=bole-pds
PORT=3000

CLOUDINARY_CLOUD_NAME=dboboadol
CLOUDINARY_API_KEY=981294169774582
CLOUDINARY_API_SECRET=kzpwEO7PXd_GQvHlrT0QUM6mMIA

JWT_SECRET=5bRzwcM95654ZI7oOhxKg3GQtkzsGynz
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=7

EMAIL=alfeman4@gmail.com
EMAIL_PASS=uboh cpuu qgfp bsdw
```

### 4.2 Frontend Environment Setup
```bash
cd /home/deploy/bole-pds1/frontend
nano .env.local
```

Create the environment file:
```env
NEXT_PUBLIC_API_URL=http://49.12.106.102:3000
# or if you have a domain:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Step 5: Build the Frontend

### 5.1 Build the Next.js application
```bash
cd /home/deploy/bole-pds1/frontend
npm run build
```

## Step 6: Configure PM2 for Process Management

### 6.1 Create PM2 ecosystem file
```bash
cd /home/deploy/bole-pds1
nano ecosystem.config.js
```

Create the ecosystem configuration:
```javascript
module.exports = {
  apps: [
    {
      name: 'bole-pds-backend',
      script: './backend/server.js',
      cwd: '/home/deploy/bole-pds1',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'bole-pds-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/bole-pds1/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log',
      time: true
    }
  ]
};
```

### 6.2 Start applications with PM2
```bash
cd /home/deploy/bole-pds1
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 7: Configure Nginx as Reverse Proxy

### 7.1 Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/bole-pds
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name 49.12.106.102;  # Replace with your domain if you have one

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/bole-pds /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 8: SSL Certificate (Optional but Recommended)

### 8.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Get SSL certificate (if you have a domain)
```bash
sudo certbot --nginx -d yourdomain.com
```

## Step 9: Security Hardening

### 9.1 Configure firewall
```bash
sudo ufw status
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
```

### 9.2 Set up automatic security updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Step 10: Monitoring and Maintenance

### 10.1 PM2 monitoring commands
```bash
# View running processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart applications
pm2 restart all

# Update applications
pm2 reload all
```

### 10.2 Nginx monitoring
```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Step 11: Deployment Script

Create a deployment script for easy updates:
```bash
nano /home/deploy/deploy.sh
```

```bash
#!/bin/bash
cd /home/deploy/bole-pds1

# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Build frontend
cd frontend
npm run build
cd ..

# Restart applications
pm2 restart all

echo "Deployment completed!"
```

Make it executable:
```bash
chmod +x /home/deploy/deploy.sh
```

## Troubleshooting

### Common Issues:

1. **Port already in use**: Check if ports 3000 and 4000 are free
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :4000
   ```

2. **Permission denied**: Ensure proper file permissions
   ```bash
   sudo chown -R deploy:deploy /home/deploy/bole-pds1
   ```

3. **Nginx not working**: Check configuration and restart
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **PM2 issues**: Check logs and restart
   ```bash
   pm2 logs
   pm2 restart all
   ```

## Access Your Application

- Frontend: `http://49.12.106.102` or `https://yourdomain.com`
- Backend API: `http://49.12.106.102/api` or `https://yourdomain.com/api`

## Backup Strategy

### 1. Database Backup
Since you're using MongoDB Atlas, backups are handled automatically.

### 2. Application Backup
```bash
# Create backup script
nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /home/deploy/bole-pds1

# Keep only last 7 backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete
```

Make it executable and add to crontab:
```bash
chmod +x /home/deploy/backup.sh
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh
```

Your application should now be successfully deployed and running on your Ubuntu VPS! 