FROM debian

RUN apt-get update \
    && apt-get install -y \
      wget \
      apache2 \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg \
	&& echo "deb https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list \
	&& apt-get update \
	&& apt-get -y install \
    php5.6 \
    libapache2-mod-php5.6 \
    php5.6-mysql

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

WORKDIR /var/www/html

CMD ["apache2ctl", "-D", "FOREGROUND"]
