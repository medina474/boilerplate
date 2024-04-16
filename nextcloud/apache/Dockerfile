FROM httpd:2.4-bookworm

# Change port and update server name
#RUN sed -i \
    # -e 's/Listen 80/Listen 8000/' \
    #-e 's/^#ServerName.*/ServerName localhost:8000/' \
    #/usr/local/apache2/conf/httpd.conf

# Enable proxy and fcgi modules
RUN sed -i \
    -e 's/^#\(LoadModule proxy_module modules\/mod_proxy.so\)/\1/' \
    -e 's/^#\(LoadModule proxy_fcgi_module modules\/mod_proxy_fcgi.so\)/\1/' \
    /usr/local/apache2/conf/httpd.conf

# Add vhost configuration and copy vhost file
#COPY conf/httpd-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf
#RUN sed -i \
#    -e 's/#Include\ conf\/extra\/httpd-vhosts.conf/Include\ conf\/extra\/httpd-vhosts.conf/' \
#    /usr/local/apache2/conf/httpd.conf

# Create users, directories and update permissions
RUN set -eux; \
  mkdir -p /var/www/html /usr/local/apache2/logs; \
  addgroup --gid 1000 nextcloud; \
  adduser --disabled-password --no-create-home --home /var/www/html --shell /sbin/nologin --gid 1000 --uid 1000 nextcloud; \
  chown -R nextcloud:nextcloud /var/www/html /usr/local/apache2/logs;

# Change owner and group
USER nextcloud:nextcloud

# Change workdir
WORKDIR /var/www/html

COPY ./setup-nextcloud.php /var/www/html/

# Start apache
CMD ["httpd-foreground"]
