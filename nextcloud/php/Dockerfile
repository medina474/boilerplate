FROM php:php:8.3.6-fpm-bookworm

# Set timezone
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Change port and update user, owner and group
RUN sed -i \
    -e 's/^user = www-data*/user = app/' \
    -e 's/^group = www-data*/group = app/' \
    -e 's/^;listen.owner = www-data*/listen.owner = app/' \
    -e 's/^;listen.group = www-data*/listen.group = app/' \
    /usr/local/etc/php-fpm.d/www.conf

# Create users, directories and update permissions
RUN addgroup -g 1000 app \
    && adduser -D -H -h /var/www/html -s /sbin/nologin -G app -u 1000 app \
    && mkdir -p /var/www/html /sock /var/log/php \
    && chown -R app:app /var/www/html /usr/local/etc /sock /var/log/php

# Change owner and group
USER app:app

# Change workdir
WORKDIR /var/www/html

# Expose port 9000
EXPOSE 9000
