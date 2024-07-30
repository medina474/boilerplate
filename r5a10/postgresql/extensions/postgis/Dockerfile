FROM debian:testing-slim AS build-essential

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  build-essential \
  cmake \
#  checkinstall \
  ;

# checkinstall n'est plus disponible dans testing
ADD checkinstall_1.6.2+git20170426.d24a630-3+b1_amd64.deb \
  /tmp/checkinstall.deb

RUN set -eux; \
 apt-get install -y /tmp/checkinstall.deb;

# =============================================================================
#

FROM build-essential AS build-pgdev

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  postgresql-server-dev-16 \
  ;

  # =============================================================================
# sfcgal
# SFCGAL est une bibliothèque wrapper C++ autour de CGAL qui fournit des types
# de géométrie et des opérations 3D conformes aux normes ISO 19107:2013 et
# OGC Simple Features Access 1.2.
# PostGIS utilise l'API C pour exposer certaines fonctions de SFCGAL dans
# des bases de données spatiales
FROM build-pgdev AS sfcgal

# Télécharger
ARG sfcgal_release=1.5.1

ADD "https://gitlab.com/sfcgal/SFCGAL/-/archive/v${sfcgal_release}/SFCGAL-v${sfcgal_release}.tar.gz" \
    /tmp/sfcgal.tar.gz

# Extraire
RUN tar -xvf /tmp/sfcgal.tar.gz -C /tmp --one-top-level --strip-components 1 && \
    rm -rf /tmp/sfcgal.tar.gz

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcgal-dev \
    libboost-serialization1.83-dev \
    libmpfr-dev \
    libgmp-dev \
    && rm -rf /var/lib/apt/lists/*

# Build from source
WORKDIR /tmp/sfcgal/build
RUN cmake .. && make -j1

# Create debian package
RUN checkinstall -D --install=yes --fstrans=no --backup=no --pakdir=/tmp \
  --pkgname=sfcgal --pkgversion=${sfcgal_release} \
  --requires=libgmpxx4ldbl,libboost-serialization1.83.0,libmpfr6 --nodoc


# =============================================================================
# PostGIS
FROM sfcgal AS postgis

ARG postgis_release=3.5.0

ADD "https://postgis.net/stuff/postgis-${postgis_release}dev.tar.gz" \
  /tmp/postgis.tar.gz

RUN set -eux; \
  tar -xvf /tmp/postgis.tar.gz -C /tmp; \
  rm -rf /tmp/postgis.tar.gz;

# Installer les dépendances de compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libgeos-dev \
  libproj-dev \
  protobuf-c-compiler \
  libprotobuf-c-dev \
  libgdal-dev \
  ;

WORKDIR /tmp/postgis-${postgis_release}dev
RUN ./configure --with-sfcgal; \
  make -j$(nproc);

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --requires=libgeos-c1v5,libproj25,libjson-c5,libprotobuf-c1,libgdal35 \
  --pkgname=postgis --pkgversion=${postgis_release} \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
