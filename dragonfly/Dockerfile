FROM alpine:3.18.3

RUN apk update && apk add wget make gcc libevent-dev msgpack-c-dev musl-dev openssl-dev bsd-compat-headers jq



RUN wget -q https://api.github.com/repos/nicolasff/webdis/tags -O /dev/stdout | jq '.[] | .name' | head -1  | sed 's/"//g' > latest
RUN wget https://github.com/nicolasff/webdis/archive/$(cat latest).tar.gz -O webdis-latest.tar.gz

ADD --checksum=${postgresql_release_checksum} \
  "https://ftp.postgresql.org/pub/source/v16.2/postgresql-${postgresql_release}.tar.gz" \
  /tmp/webdis.tar.gz

RUN set -eux; \
  tar -xvf /tmp/webdis.tar.gz -C /tmp; \
  rm -rf /tmp/webdis.tar.gz;

WORKDIR /temp/webdis

RUN make && make install && make clean && make SSL=1 && cp webdis /usr/local/bin/webdis-ssl && cd ..

COPY webdis.json /etc/webdis.json
WORKDIR /usr/local/bin/

EXPOSE 7379
CMD ./webdis /etc/webdis.json
