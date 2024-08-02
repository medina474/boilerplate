FROM postgres:16.3-bookworm

# Ajouter les dépôts de la branche testing
RUN echo 'deb http://deb.debian.org/debian testing main contrib non-free' >> /etc/apt/sources.list

# Configurer les préférences APT pour définir les priorités
RUN echo 'Package: *\nPin: release a=testing\nPin-Priority: 90' > /etc/apt/preferences.d/testing

RUN set eux; \
  apt-get update;

WORKDIR /tmp

ADD http://maquette.neotech.fr/debian/sfcgal_1.5.1-1_amd64.deb ./
ADD http://maquette.neotech.fr/debian/postgis_3.5.0-1_amd64.deb ./
ADD http://maquette.neotech.fr/debian/pgrouting_3.6.2-1_amd64.deb ./

RUN set eux; \
  apt-get update; \
  apt-get install -y -t testing \
    libgeos-c1t64 \
    libjson-c5 \
    libgdal35 \
    libboost-serialization1.83.0 \
    ./sfcgal_1.5.1-1_amd64.deb \
    ./postgis_3.5.0-1_amd64.deb \
    ./pgrouting_3.6.2-1_amd64.deb \
    ;

ADD http://maquette.neotech.fr/debian/postgresql-anonymizer_1.3.2-1_amd64.deb ./
RUN apt-get install ./postgresql-anonymizer_1.3.2-1_amd64.deb

ADD http://maquette.neotech.fr/debian/timescaledb_2.13.0-1_amd64.deb ./
RUN apt-get install ./timescaledb_2.13.0-1_amd64.deb

ADD http://maquette.neotech.fr/debian/timescaledb_2.13.0-1_amd64.deb ./
RUN apt-get install ./timescaledb_2.13.0-1_amd64.deb

ADD http://maquette.neotech.fr/debian/pgx_ulid-v0.1.5-pg16-amd64-linux-gnu.deb ./
RUN apt-get install ./pgx_ulid-v0.1.5-pg16-amd64-linux-gnu.deb

ADD http://maquette.neotech.fr/debian/pgvector_0.6.2-1_amd64.deb ./
RUN apt-get install ./pgvector_0.6.2-1_amd64.deb

ADD http://maquette.neotech.fr/debian/madlib_2.1.0-1_amd64.deb ./
RUN apt-get install ./madlib_2.1.0-1_amd64.deb

# Exporter

ADD https://github.com/prometheus-community/postgres_exporter/releases/download/v0.15.0/postgres_exporter-0.15.0.linux-amd64.tar.gz ./
RUN set -eux; \
  tar xfz postgres_exporter-0.15.0.linux-amd64.tar.gz; \
  mv postgres_exporter-0.15.0.linux-amd64/postgres_exporter /usr/bin/;

RUN set eux; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/*; \
  rm -rf /tmp/*.deb;

ADD extensions/age/age.so /usr/lib/postgresql/16/lib/
ADD extensions/age/age.control /usr/share/postgresql/13/extension/
ADD extensions/age/age--1.5.0.sql /usr/share/postgresql/13/extension/
