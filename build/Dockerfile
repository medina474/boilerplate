#docker build ./ -t boilerplate/build:2024.04
FROM debian:testing-slim as base

RUN set -ex; \
  apt-get update; \
  apt-get upgrade -y

RUN apt-get update; \
  apt-get install -y --no-install-recommends \
    openssl \
    gnupg \
    less \
    ca-certificates; \
  rm -rf /var/lib/apt/lists/*

CMD tail -f /dev/null
