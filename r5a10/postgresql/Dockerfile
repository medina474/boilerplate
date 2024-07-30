FROM postgres:16.3-bookworm

ADD "extensions/*.deb" \
  /tmp

# Ajouter les dépôts de la branche testing
RUN echo 'deb http://deb.debian.org/debian testing main contrib non-free' >> /etc/apt/sources.list

# Configurer les préférences APT pour définir les priorités
RUN echo 'Package: *\nPin: release a=testing\nPin-Priority: 90' > /etc/apt/preferences.d/testing

RUN set eux; \
  apt-get update; \
  apt-get install -y -t testing \
    libgeos-c1v5 \
    libjson-c5 \
    -t testing libgdal34 \
    libboost-serialization1.83.0 \
    /tmp/sfcgal_1.5.1-1_amd64.deb \
    /tmp/postgis_3.5.0-1_amd64.deb \
    ;

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
