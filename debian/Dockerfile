#docker build ./ -t boilerplate/debian:2024.07
FROM debian:experimental AS build-essential

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y \
  apt-get install -y --no-install-recommends \
  build-essential \
  checkinstall \
  cmake \
  ;

FROM build-essential AS build-pgdev

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  postgresql-server-dev-16 \
  ;

# =============================================================================
# Periods
# https://github.com/xocolatl/periods
# Periods est une extension qui prend en charge les tables temporelles
# versionnées par le système. Les tables temporelles permettent de conserver un
# enregistrement historique des modifications de données dans une table.
#

FROM build-pgdev AS periods

ARG periods_release=1.2.2
ARG periods_release_checksum=sha256:36ec2e362df3389bae1591ef837f527554bb8c58be26e2b2481971a492417521

ADD --checksum=${periods_release_checksum} \
  "https://github.com/xocolatl/periods/archive/refs/tags/v${periods_release}.tar.gz" \
  /tmp/periods.tar.gz

RUN set -eux; \
  tar -xvf /tmp/periods.tar.gz -C /tmp; \
  rm -rf /tmp/periods.tar.gz;

WORKDIR /tmp/periods-${periods_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --pkgname=periods --pkgversion=${periods_release} \
  --nodoc
