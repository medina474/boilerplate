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
# pgVector
FROM build-pgdev AS pgvector

ARG pgvector_release=0.6.2

ADD "https://github.com/pgvector/pgvector/archive/refs/tags/v${pgvector_release}.tar.gz" \
  /tmp/pgvector.tar.gz

RUN tar -xvf /tmp/pgvector.tar.gz -C /tmp && \
  rm -rf /tmp/pgvector.tar.gz

# Build from source
WORKDIR /tmp/pgvector-${pgvector_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
