#docker build ./ -t boilerplate/build:2024.04
FROM debian:testing-slim as base

ARG timescaledb_release=2.13.0
ARG timescaledb_release_checksum=sha256:584a351c7775f0e067eaa0e7277ea88cab9077cc4c455cbbf09a5d9723dce95d

ARG postgis_release=3.4.2
ARG postgis_release_checksum=sha256:99a1ed79d6f714e52548eca3bb8e5593c6745f1bde92eb5fb858efd8984dffa2

ARG pgrouting_release=3.6.2
ARG pgrouting_release_checksum=sha256:f4a1ed79d6f714e52548eca3bb8e5593c6745f1bde92eb5fb858efd8984dffa2

ARG periods_release=1.2.2
ARG periods_release_checksum=sha256:36ec2e362df3389bae1591ef837f527554bb8c58be26e2b2481971a492417521

ARG age_release=1.5.0-rc0
ARG age_release_checksum=sha256:7bb4a89661cbcf9a91a332e4e963fd245182be20e540a61a9a2ca0f835a083d8

ARG pgvector_release=0.6.2
ARG age_release_checksum=sha256:7bb4a89661cbcf9a91a332e4e963fd245182be20e540a61a9a2ca0f835a083d8

ARG libsodium_release=1.0.18
ARG libsodium_release_checksum=sha256:6f504490b342a4f8a4c4a02fc9b866cbef8622d5df4e5452b46be121e46636c1

ARG pgsodium_release=3.1.6
ARG pgsodium_release_checksum=sha256:f46af33b13ce895b3d8eb2c01c2d5b0b6528eab1e51cd624ddc54daea26e230e

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    openssl \
    gnupg \
    less \
    ca-certificates \
    postgresql-server-dev-16 \
    build-essential \
    cmake \
    checkinstall \
    ; \
  rm -rf /var/lib/apt/lists/*;


# =============================================================================
# PostGIS
FROM base as postgis

ARG postgis_release
ARG postgis_release_checksum

ADD --checksum=${postgis_release_checksum} \
  "https://postgis.net/stuff/postgis-${postgis_release}dev.tar.gz" \
  /tmp/postgis.tar.gz

RUN set -eux; \
  tar -xvf /tmp/postgis.tar.gz -C /tmp; \
  rm -rf /tmp/postgis.tar.gz;

WORKDIR /tmp/postgis-${pgrouting_release}

RUN ./configure; \
  make -j$(nproc);

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=postgis --pkgversion=${postgis_release} --nodoc

# =============================================================================
# pgRouting
# https://github.com/pgRouting/pgrouting
# pgRouting étend la base de données géospatiale PostGIS / PostgreSQL pour
# fournir une fonctionnalité de routage géospatial.
#
FROM base as pgrouting

ARG pgrouting_release
ARG pgrouting_release_checksum

ADD --checksum=${pgrouting_release_checksum} \
  "https://github.com/pgRouting/pgrouting/releases/download/v${pgrouting_release}/pgrouting-${pgrouting_release}.tar.gz" \
  /tmp/pgrouting.tar.gz

RUN set -eux; \
  tar -xvf /tmp/pgrouting.tar.gz -C /tmp; \
  rm -rf /tmp/pgrouting.tar.gz;

# Installer les dépendances pour la compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    libboost-all-dev \
  ; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /tmp/pgrouting-${pgrouting_release}/build
RUN cmake -DBUILD_HTML=OFF -DBUILD_DOXY=OFF ..

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=pgrouting --pkgversion=${pgrouting_release} --nodoc


# =============================================================================
# PostgreSQL


# =============================================================================
# Periods
# https://github.com/xocolatl/periods
# Periods est une extension qui prend en charge les tables temporelles
# versionnées par le système. Les tables temporelles permettent de conserver un
# enregistrement historique des modifications de données dans une table.
#

FROM base as periods

ARG periods_release
ARG periods_release_checksum

ADD --checksum=${periods_release_checksum} \
  "https://github.com/xocolatl/periods/archive/refs/tags/v${periods_release}.tar.gz" \
  /tmp/periods.tar.gz

RUN set -eux; \
  tar -xvf /tmp/periods.tar.gz -C /tmp; \
  rm -rf /tmp/periods.tar.gz;

WORKDIR /tmp/periods-${periods_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=periods --pkgversion=${periods_release} --nodoc


# =============================================================================
# TimescaleDB

FROM base as timescaledb
ARG timescaledb_release
ARG timescaledb_release_checksum

# Download and extract
ADD --checksum=${timescaledb_release_checksum} \
  "https://github.com/timescale/timescaledb/archive/refs/tags/${timescaledb_release}.tar.gz" \
  /tmp/timescaledb.tar.gz

RUN set -eux; \
  tar -xvf /tmp/timescaledb.tar.gz -C /tmp; \
  rm -rf /tmp/timescaledb.tar.gz;

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libkrb5-dev \
  ; \
  rm -rf /var/lib/apt/lists/*

# Build from source
WORKDIR /tmp/timescaledb-${timescaledb_release}
RUN ./bootstrap

WORKDIR /tmp/timescaledb-${timescaledb_release}/build
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=timescaledb --pkgversion=${timescaledb_release} --nodoc


# =============================================================================
# Apache Age
# https://github.com/apache/age

FROM base as age

ARG age_release
ARG age_release_checksum

ADD --checksum=${age_release_checksum} \
  "https://github.com/apache/age/archive/refs/tags/PG16/v${age_release}.tar.gz" \
  /tmp/age.tar.gz

RUN set -eux; \
  tar -xvf /tmp/age.tar.gz -C /tmp; \
  rm -rf /tmp/age.tar.gz;

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libreadline-dev \
  zlib1g-dev \
  bison \
  flex \
  ; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /tmp/age-PG16-v${age_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=age --nodoc

# =============================================================================
# pgSodium
# https://github.com/michelp/pgsodium
# pgsodium est une extension de bibliothèque de chiffrement pour PostgreSQL
# utilisant la bibliothèque libsodium pour les algorithmes cryptographiques
# de haut niveau.

FROM base as libsodium

ARG libsodium_release
ARG libsodium_release_checksum

ADD --checksum=${libsodium_release_checksum} \
  "https://download.libsodium.org/libsodium/releases/libsodium-${libsodium_release}.tar.gz" \
  /tmp/libsodium.tar.gz

RUN tar -xvf /tmp/libsodium.tar.gz -C /tmp && \
  rm -rf /tmp/libsodium.tar.gz

# Build from source
WORKDIR /tmp/libsodium-${libsodium_release}
RUN ./configure; \
  make -j$(nproc); \
  make install;

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=libsodium23 --nodoc

FROM libsodium as pgsodium

ARG pgsodium_release
ARG pgsodium_release_checksum

ADD --checksum=${pgsodium_release_checksum} \
  "https://github.com/michelp/pgsodium/archive/refs/tags/v${pgsodium_release}.tar.gz" \
  /tmp/pgsodium.tar.gz

RUN tar -xvf /tmp/pgsodium.tar.gz -C /tmp && \
  rm -rf /tmp/pgsodium.tar.gz

  # Build from source
WORKDIR /tmp/pgsodium-${pgsodium_release}
RUN make -j$(nproc)

  # Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --requires=libsodium23 --nodoc

# =============================================================================
FROM base as pgvector

ARG pgvector_release
ARG pgvector_release_checksum

ADD --checksum=${pgvector_release_checksum} \
  "https://github.com/pgvector/pgvector/archive/refs/tags/v${pgvector_release}.tar.gz" \
  /tmp/pgvector.tar.gz

RUN tar -xvf /tmp/pgvector.tar.gz -C /tmp && \
  rm -rf /tmp/pgvector.tar.gz

# Build from source
WORKDIR /tmp/pgvector-${pgvector_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --nodoc

# =============================================================================
# Image finale de production
#
FROM debian:testing-slim as production

# Copier les packages des différents images
COPY --from=timescaledb /tmp/*.deb /tmp
COPY --from=age /tmp/*.deb /tmp
COPY --from=pgrouting /tmp/*.deb /tmp
COPY --from=periods /tmp/*.deb /tmp
COPY --from=pgvector /tmp/*.deb /tmp
COPY --from=pgsodium /tmp/*.deb /tmp
COPY --from=postgis /tmp/*.deb /tmp

RUN set -eux; \
  apt-get install /tmp/*.deb -y;

CMD tail -f /dev/null
