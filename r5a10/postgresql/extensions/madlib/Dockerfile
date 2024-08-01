#docker build ./ -t boilerplate/madlib:2024.04
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
	python3 \
  ;

# checkinstall n'est plus disponible dans testing
ADD http://maquette.neotech.fr/debian/checkinstall_1.6.2+git20170426.d24a630-3+b1_amd64.deb /tmp
RUN apt-get install -y /tmp/checkinstall_1.6.2+git20170426.d24a630-3+b1_amd64.deb;

# =============================================================================
# Apache MADlib
#
FROM build-essential AS madlib

# Télécharger
ARG m4_release=1.4.19

ADD "https://ftp.gnu.org/gnu/m4/m4-${m4_release}.tar.gz" \
/tmp/m4.tar.gz

# Extraire
RUN tar -xvf /tmp/m4.tar.gz -C /tmp && \
  rm -rf /tmp/m4.tar.gz

WORKDIR /tmp/m4-${m4_release}
RUN ./configure --prefix=/usr/local/m4 && \
  make && \
  make install

# Télécharger
ARG madlib_release=2.1.0
ARG madlib_release_checksum=sha256:41a46a31a877f411bded38a26afb302bccfadf8152913d8268124e474d21fe3a

ADD --checksum=${madlib_release_checksum} \
    "https://dist.apache.org/repos/dist/release/madlib/${madlib_release}/apache-madlib-${madlib_release}-src.tar.gz" \
    /tmp/madlib.tar.gz

# Extraire
RUN tar -xvf /tmp/madlib.tar.gz -C /tmp && \
    rm -rf /tmp/madlib.tar.gz

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    libboost-system-dev \
  ;

# Build from source
WORKDIR /tmp/apache-madlib-${madlib_release}-src/build
RUN PATH=$PATH:/usr/local/m4/bin && \
  cmake .. && \
	make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp \
  --pkgname=madlib --pkgversion=${madlib_release} \
  --nodoc

CMD ["tail", "-f", "/dev/null"]
