#docker build ./ -t boilerplate/build:2024.04
FROM debian:testing-slim

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y; \
  apt-get install -y --no-install-recommends \
  build-essential \
  cmake \
  checkinstall \
  ;

ADD "https://ftp.gnu.org/gnu/m4/m4-1.4.19.tar.gz" \
  /tmp/m4.tar.gz

# Extraire
RUN tar -xvf /tmp/m4.tar.gz -C /tmp && \
  rm -rf /tmp/m4.tar.gz

WORKDIR /tmp/m4-1.4.19
RUN ./configure --prefix=/usr/local/m4 && make && make install

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
  python3 \
  ;

# Build from source
WORKDIR /tmp/apache-madlib-${madlib_release}-src/build
RUN PATH=$PATH:/usr/local/m4/bin && cmake .. && make -j$(nproc)


CMD ["tail", "-f", "/dev/null"]
