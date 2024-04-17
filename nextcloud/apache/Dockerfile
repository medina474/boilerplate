FROM httpd:2.4-bookworm

# Create users, directories and update permissions
RUN set -eux; \
  mkdir -p /var/www/html /usr/local/apache2/logs; \
  addgroup --gid 1000 nextcloud; \
  adduser --disabled-password --no-create-home --home /var/www/html --shell /sbin/nologin --gid 1000 --uid 1000 nextcloud; \
  chown -R nextcloud:nextcloud /var/www/html /usr/local/apache2/logs;

USER nextcloud:nextcloud

ADD ./httpd.conf /usr/local/apache2/conf/httpd.conf

VOLUME /var/www/html
WORKDIR /var/www/html

CMD ["httpd-foreground"]
