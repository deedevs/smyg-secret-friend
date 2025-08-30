# SMYG Digital Secret Friend - Deployment Guide

## Domain Setup

1. Configure DNS for smyg.site:
   ```
   # A Records
   @     IN A     [YOUR_SERVER_IP]
   www   IN A     [YOUR_SERVER_IP]
   api   IN A     [YOUR_SERVER_IP]
   ```

## Server Setup

1. Install required software:
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx docker docker-compose
   ```

2. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d smyg.site -d www.smyg.site -d api.smyg.site
   ```

## Backend Deployment

1. Build the backend:
   ```bash
   cd server
   docker build -t smyg-backend .
   ```

2. Create production environment file:
   ```bash
   # .env.production
   NODE_ENV=production
   PORT=4000
   MONGO_URI=mongodb+srv://dladipo21:pWhs70U0bqHWlNcj@washme-app.lcwiu.mongodb.net/smyg-secret-friend
   JWT_SECRET=[GENERATE_STRONG_SECRET]
   COOKIE_NAME=smyg_auth
   COOKIE_SECURE=true
   ```

3. Run the backend:
   ```bash
   docker run -d \
     --name smyg-backend \
     --restart unless-stopped \
     -p 4000:4000 \
     --env-file .env.production \
     smyg-backend
   ```

## Frontend Deployment

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy to web server:
   ```bash
   sudo mkdir -p /var/www/smyg.site
   sudo cp -r dist/* /var/www/smyg.site/
   ```

3. Configure Nginx:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/smyg.site
   sudo ln -s /etc/nginx/sites-available/smyg.site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Security Checklist

1. Firewall Rules:
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 4000
   ```

2. Set secure headers (already in nginx.conf)
3. Enable SSL/TLS (done with certbot)
4. Set up automatic SSL renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Monitoring

1. Check backend logs:
   ```bash
   docker logs -f smyg-backend
   ```

2. Check nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## Backup

1. Database backup (daily):
   ```bash
   mongodump --uri "mongodb+srv://dladipo21:pWhs70U0bqHWlNcj@washme-app.lcwiu.mongodb.net/smyg-secret-friend"
   ```

## Updates

1. Backend update:
   ```bash
   docker pull smyg-backend
   docker stop smyg-backend
   docker rm smyg-backend
   # Then run the container again
   ```

2. Frontend update:
   ```bash
   cd client
   npm run build
   sudo cp -r dist/* /var/www/smyg.site/
   ```

## Troubleshooting

1. Check backend health:
   ```bash
   curl http://localhost:4000/health
   ```

2. Check SSL:
   ```bash
   curl https://smyg.site
   ```

3. Test nginx config:
   ```bash
   sudo nginx -t
   ```

## Rollback Plan

1. Keep previous versions of frontend builds
2. Use docker tags for backend versions
3. Maintain database backups

## Performance Optimization

1. Enable gzip compression (done in nginx.conf)
2. Set up proper caching headers (done in nginx.conf)
3. Use CDN for static assets if needed

## Maintenance

1. Regular tasks:
   - Monitor disk space
   - Check logs for errors
   - Update SSL certificates
   - Backup database
   - Update dependencies
