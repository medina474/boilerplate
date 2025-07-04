FROM alpine:3.18.3 AS stage
LABEL maintainer="Nicolas Favre-Felix <n.favrefelix@gmail.com>"

RUN apk update && apk add wget make gcc libevent-dev msgpack-c-dev musl-dev openssl-dev bsd-compat-headers jq
RUN wget -q https://api.github.com/repos/nicolasff/webdis/tags -O /dev/stdout | jq '.[] | .name' | head -1  | sed 's/"//g' > latest
RUN wget https://github.com/nicolasff/webdis/archive/$(cat latest).tar.gz -O webdis-latest.tar.gz
RUN tar -xvzf webdis-latest.tar.gz
RUN cd webdis-$(cat latest) && make && make install && make clean && make SSL=1 && cp webdis /usr/local/bin/webdis-ssl && cd ..
RUN sed -i -e 's/"daemonize":.*true,/"daemonize": false,/g' /etc/webdis.prod.json

# main image
FROM alpine:3.18.3
# Required dependencies, with versions fixing known security vulnerabilities
RUN apk update && apk add libevent msgpack-c openssl \
    'redis>=6.2.10' 'libssl3>=3.0.10-r0' 'libcrypto3>=3.0.10-r0' \
    'libssl1.1' 'libcrypto1.1>=1.1.1u-r1' && \
    rm -f /var/cache/apk/* /usr/bin/redis-benchmark /usr/bin/redis-cli
COPY --from=stage /usr/local/bin/webdis /usr/local/bin/webdis-ssl /usr/local/bin/
COPY --from=stage /etc/webdis.prod.json /etc/webdis.prod.json
RUN echo "daemonize yes" >> /etc/redis.conf
CMD /usr/bin/redis-server /etc/redis.conf && /usr/local/bin/webdis /etc/webdis.prod.json

EXPOSE 7379



docker build ./ -t boilerplate/build:2024.07
