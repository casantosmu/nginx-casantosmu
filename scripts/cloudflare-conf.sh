#!/bin/bash

CLOUDFLARE_FILE_PATH="/etc/nginx/conf.d/cloudflare.conf"

echo "## Cloudflare Real IP visitors ##" > $CLOUDFLARE_FILE_PATH;
echo "" >> $CLOUDFLARE_FILE_PATH;

echo "# IP v4" >> $CLOUDFLARE_FILE_PATH;
for i in $(curl -sL https://www.cloudflare.com/ips-v4); do
        echo "set_real_ip_from $i;" >> $CLOUDFLARE_FILE_PATH;
done

echo "" >> $CLOUDFLARE_FILE_PATH;
echo "# IP v6" >> $CLOUDFLARE_FILE_PATH;
for i in $(curl -sL https://www.cloudflare.com/ips-v6); do
        echo "set_real_ip_from $i;" >> $CLOUDFLARE_FILE_PATH;
done

echo "" >> $CLOUDFLARE_FILE_PATH;
echo "real_ip_header CF-Connecting-IP;" >> $CLOUDFLARE_FILE_PATH;

nginx -t && systemctl reload nginx
