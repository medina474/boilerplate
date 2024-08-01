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
# Apache Age
# https://github.com/apache/age

FROM build-pgdev AS age

ARG age_release=1.5.0-rc0

ADD "https://github.com/apache/age/archive/refs/tags/PG16/v${age_release}.tar.gz" \
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
  ;

WORKDIR /tmp/age-PG16-v${age_release}
RUN make -j$(nproc) install

# Create debian package
#RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
#  --nodoc

CMD ["tail", "-f", "/dev/null"]
