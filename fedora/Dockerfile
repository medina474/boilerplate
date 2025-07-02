#docker build ./ -t boilerplate/fedora:2024.04
FROM fedora:40 AS build-essential

RUN set -eux; \
  dnf update -y; \
  dnf install -y postgresql-server; \
  dnf clean all;

CMD ["tail", "-f", "/dev/null"]
