FROM postgres:$POSTGRES_VERION

ENV TZ Europe/Paris
ENV LANG fr_FR.utf8
ENV LANGUAGE fr_FR.UTF-8
ENV LC_ALL fr_FR.UTF-8

ENV POSTGIS_MAJOR 3
ENV POSTGIS_VERSION 3.4.2+dfsg-1.pgdg110+1

RUN apt update \
  && apt_upgrade \
  && apt-cache showpkg postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
  && apt-get install -y --no-install-recommends \
        # ca-certificates: for accessing remote raster files;
        #   fix: https://github.com/postgis/docker-postgis/issues/307
        ca-certificates \
        \
        postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
        postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./initdb-postgis.sh /docker-entrypoint-initdb.d/10_postgis.sh
COPY ./update-postgis.sh /usr/local/bin
