#docker build ./ -t boilerplate/build:2024.04
FROM debian:testing-slim

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y


CMD ["tail", "-f", "/dev/null"]
