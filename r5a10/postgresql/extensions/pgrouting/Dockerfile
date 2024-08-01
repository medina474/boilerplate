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
ADD http://maquette.neotech.fr/debian/checkinstall_1.6.2+git20170426.d24a630-3+b1_amd64.deb /tmp
RUN apt-get install -y /tmp/checkinstall_1.6.2+git20170426.d24a630-3+b1_amd64.deb;

# =============================================================================
#

FROM build-essential AS build-pgdev

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  postgresql-server-dev-16 \
  ;

# =============================================================================
# pgRouting
# https://github.com/pgRouting/pgrouting
# pgRouting étend la base de données géospatiale PostGIS / PostgreSQL pour
# fournir une fonctionnalité de routage géospatial.
#
FROM build-pgdev AS pgrouting

ARG pgrouting_release=3.6.2

ADD "https://github.com/pgRouting/pgrouting/releases/download/v${pgrouting_release}/pgrouting-${pgrouting_release}.tar.gz" \
  /tmp/pgrouting.tar.gz

RUN set -eux; \
  tar -xvf /tmp/pgrouting.tar.gz -C /tmp; \
  rm -rf /tmp/pgrouting.tar.gz;

# Installer les dépendances de compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libboost-all-dev \
  ;

WORKDIR /tmp/pgrouting-${pgrouting_release}/build
RUN cmake -DBUILD_HTML=OFF -DBUILD_DOXY=OFF ..

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --pkgname=pgrouting --pkgversion=${pgrouting_release} \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
