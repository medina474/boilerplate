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
# TimescaleDB

FROM build-pgdev AS timescaledb

ARG timescaledb_release=2.13.0

# Download and extract
ADD "https://github.com/timescale/timescaledb/archive/refs/tags/${timescaledb_release}.tar.gz" \
  /tmp/timescaledb.tar.gz

RUN set -eux; \
  tar -xvf /tmp/timescaledb.tar.gz -C /tmp; \
  rm -rf /tmp/timescaledb.tar.gz;

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libkrb5-dev \
  ;

# Build from source
WORKDIR /tmp/timescaledb-${timescaledb_release}
RUN ./bootstrap

WORKDIR /tmp/timescaledb-${timescaledb_release}/build
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --pkgname=timescaledb --pkgversion=${timescaledb_release} \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
