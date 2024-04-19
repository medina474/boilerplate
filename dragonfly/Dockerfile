FROM alpine:3.18.3

RUN apk update && apk add wget make gcc libevent-dev msgpack-c-dev musl-dev openssl-dev bsd-compat-headers jq

ADD "https://github.com/nicolasff/webdis/archive/0.1.22.tar.gz" \
  /tmp/webdis.tar.gz

RUN set -eux; \
  tar -xvf /tmp/webdis.tar.gz -C /tmp; \
  rm -rf /tmp/webdis.tar.gz;

WORKDIR /tmp/webdis-0.1.22

RUN set -eux; \
  make; \
  make install; \
  make clean; \
  make SSL=1; \
  cp webdis /usr/local/bin/webdis-ssl;

COPY webdis.json /etc/webdis.json
WORKDIR /usr/local/bin/

EXPOSE 7379

#CMD tail -f /dev/null
CMD ./webdis /etc/webdis.json
