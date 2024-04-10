#docker build ./ -t boilerplate/build:2024.04
FROM debian:stable-slim

RUN apt-get update && apt-get upgrade

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  && rm -rf /var/lib/apt/lists/*

CMD tail -f /dev/null
