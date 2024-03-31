FROM postgres:16-bullseye

LABEL version="2024.03.29"

ENV POSTGIS_MAJOR 3
ENV POSTGIS_VERSION 3.4.2+dfsg-1.pgdg110+1

RUN apt-get update

RUN apt-cache showpkg postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR \
  && apt-get install -y --no-install-recommends \
    # ca-certificates: for accessing remote raster files;
    #   fix: https://github.com/postgis/docker-postgis/issues/307
    ca-certificates \
    \
    postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
    postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts

RUN apt-cache showpkg postgresql-16-periods \
  && apt-get install -y --no-install-recommends \
    postgresql-16-periods

RUN rm -rf /var/lib/apt/lists/*