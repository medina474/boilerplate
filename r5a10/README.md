## GOSU

# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
# ENV GOSU_VERSION 1.17

```dockerfile
ENV GOSU_VERSION=1.17
RUN set -eux; \
	rpmArch="$(rpm --query --queryformat='%{ARCH}' rpm)"; \
	case "$rpmArch" in \
		aarch64) dpkgArch='arm64' ;; \
		armv7*) dpkgArch='armhf' ;; \
		i686) dpkgArch='i386' ;; \
		ppc64le) dpkgArch='ppc64el' ;; \
		s390x|riscv64) dpkgArch=$rpmArch ;; \
		x86_64) dpkgArch='amd64' ;; \
		*) echo >&2 "error: unknown/unsupported architecture '$rpmArch'"; exit 1 ;; \
	esac; \
	curl --fail --location --output /usr/local/bin/gosu https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch} ; \
	curl --fail --location --output /usr/local/bin/gosu.asc https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-${dpkgArch}.asc; \
	GNUPGHOME="$(mktemp -d)"; \
	export GNUPGHOME; \
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	chmod a+x /usr/local/bin/gosu; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	gosu --version; \
	gosu nobody true
```

```dockerfile
# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.17
 RUN set -eux; \
 	savedAptMark="$(apt-mark showmanual)"; \
 	apt-get update; \
 	apt-get install -y --no-install-recommends ca-certificates wget; \
 	rm -rf /var/lib/apt/lists/*; \
 	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
 	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
 	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
 	export GNUPGHOME="$(mktemp -d)"; \
 	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
 	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
 	gpgconf --kill all; \
 	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
 	apt-mark auto '.*' > /dev/null; \
 	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
 	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
 	chmod +x /usr/local/bin/gosu; \
 	gosu --version; \
 	gosu nobody true
```

```dockerfile
ARG postgis_release=3.5.0
ARG postgis_release_checksum=sha256:afc8dbb2a110ebc2a5938936ccb38234d861de8c7629a2842f2fa1881e268d1

ADD --checksum=${postgis_release_checksum} \
  "https://postgis.net/stuff/postgis-${postgis_release}dev.tar.gz" \
  /tmp/postgis.tar.gz
```

```
```
