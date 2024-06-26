FROM php:8.3.6-fpm-bookworm
# https://github.com/markhilton/docker-php-fpm/tree/master

# set locale to utf-8
RUN apt-get update -y && apt-get install -y locales
ENV LANG='fr_FR.UTF-8' LANGUAGE='fr_FR:fr' LC_ALL='fr_FR.UTF-8'
RUN echo "fr_FR.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Change port and update user, owner and group
RUN sed -i \
    -e 's/^user = www-data*/user = nextcloud/' \
    -e 's/^group = www-data*/group = nextcloud/' \
    -e 's/^;listen.owner = www-data*/listen.owner = nextcloud/' \
    -e 's/^;listen.group = www-data*/listen.group = nextcloud/' \
    -e 's/^;pm.status_path = \/status*/pm.status_path = \/status/' \
    /usr/local/etc/php-fpm.d/www.conf

# Create users, directories and update permissions
RUN set -eux; \
  mkdir -p /var/www/html /sock /var/log/php; \
  addgroup --gid 1000 nextcloud; \
  adduser --disabled-password --no-create-home --home /var/www/html --shell /sbin/nologin --gid 1000 --uid 1000 nextcloud; \
  chown -R nextcloud:nextcloud /var/www/html /usr/local/etc /sock /var/log/php;

RUN set -eux; \
  apt-get update; \
  apt-get install -y \
    libzip-dev \
    ; \
    docker-php-ext-install -j$(nproc) zip; \
    docker-php-ext-install -j$(nproc) opcache; \
    docker-php-ext-install -j$(nproc) shmop;

# GD
RUN set -eux; \
  apt-get update; \
  apt-get install -y \
    libjpeg-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libfreetype6-dev \
  ; \
  docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype; \
  docker-php-ext-install -j$(nproc) gd;

# PDO MySQL / MariaDB
RUN set -eux; \
  apt-get update; \
  apt-get install -y \
  ; \
  docker-php-ext-configure pdo_mysql; \
  docker-php-ext-install -j$(nproc) pdo_mysql;

RUN set -eux; \
  apt-get -y update; \
  apt-get install -y \
    libicu-dev \
  ; \
  docker-php-ext-configure intl; \
  docker-php-ext-install -j$(nproc) intl;

RUN pecl install redis-6.0.2 \
	&& pecl install \
	&& docker-php-ext-enable redis

RUN apt-get update && apt-get install -y libmemcached-dev libssl-dev zlib1g-dev \
	&& pecl install memcached-3.2.0 \
	&& docker-php-ext-enable memcached

RUN pecl install apcu  \
	&& docker-php-ext-enable apcu

# Clean up
RUN set -eux; \
  apt-get autoremove -y; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*;

# Change owner and group
USER nextcloud:nextcloud

ADD ./php.ini /usr/local/etc/php/php.ini

VOLUME /var/www/html
WORKDIR /var/www/html

# Expose port 9000
EXPOSE 9000
