FROM debian

RUN set -eux; \
    apt-get update && apt-get install -y \
    apache2 \
  && rm -rf /var/lib/apt/lists/*

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

WORKDIR /var/www/html
RUN echo 'Hello, docker' > index.html

CMD ["apache2ctl", "-D", "FOREGROUND"]
