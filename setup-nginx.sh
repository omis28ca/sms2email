#!/bin/bash
set -e

# Install nginx
apt-get install -y nginx

# Copy site config
cp /home/pmadmin/sms2email/nginx-smsfwd.conf /etc/nginx/sites-available/smsfwd.pmsoft.dev

# Enable site
ln -sf /etc/nginx/sites-available/smsfwd.pmsoft.dev /etc/nginx/sites-enabled/smsfwd.pmsoft.dev

# Remove default site if present
rm -f /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Enable and start nginx
systemctl enable nginx
systemctl restart nginx

echo "Done. Reverse proxy for smsfwd.pmsoft.dev -> localhost:8000 is active."
echo ""
echo "To add SSL (Let's Encrypt), run:"
echo "  apt-get install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d smsfwd.pmsoft.dev"
