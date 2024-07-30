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

CMD ["tail", "-f", "/dev/null"]
