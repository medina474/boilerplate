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
# postgresql-anonymizer
FROM build-pgdev AS pganon

ARG anon_release=1.3.2

ADD "https://gitlab.com/dalibo/postgresql_anonymizer/-/archive/${anon_release}/postgresql_anonymizer-${anon_release}.tar.gz" \
  /tmp/anon.tar.gz

RUN mkdir /tmp/anon && \
  tar -xvf /tmp/anon.tar.gz -C /tmp && \
  rm -rf /tmp/anon.tar.gz

# edit make to french data

WORKDIR /tmp/postgresql_anonymizer-1.3.2
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
