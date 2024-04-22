#docker build ./ -t boilerplate/postgresql:2024.04
FROM debian:testing-slim as build-essential

RUN set -eux; \
  apt-get update; \
  apt-get upgrade -y

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  build-essential \
  cmake \
  checkinstall \
  ;

FROM build-essential as build-pgdev

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  postgresql-server-dev-16 \
  ;

# =============================================================================
# PostgreSQL
# Non utilisé
FROM build-essential as postgresql

ARG postgresql_release=16.2
ARG postgresql_release_checksum=sha256:2b8201047ec81acd1bad29dba278d788e7891b9c3e8232eda16bb29dec8131c7

ADD --checksum=${postgresql_release_checksum} \
  "https://ftp.postgresql.org/pub/source/v16.2/postgresql-${postgresql_release}.tar.gz" \
  /tmp/postgresql.tar.gz

RUN set -eux; \
  tar -xvf /tmp/postgresql.tar.gz -C /tmp; \
  rm -rf /tmp/postgresql.tar.gz;

# Installer les dépendances de compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  cmake \
  checkinstall \
  pkg-config \
  bison \
  flex \
  libicu-dev \
  libreadline-dev \
  libz-dev \
  ;

ARG PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig/

WORKDIR /tmp/postgresql-${postgresql_release}

RUN ./configure; \
  make -j$(nproc);

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=postgresql --pkgversion=${postgresql_release} --nodoc

# =============================================================================
# PostGIS
FROM build-pgdev as postgis

ARG postgis_release=3.5.0
ARG postgis_release_checksum=sha256:3982af39fc9f56bed04a0724f99d5130a0e9cb8af7892296f55d02451190cdd9

ADD --checksum=${postgis_release_checksum} \
  "https://postgis.net/stuff/postgis-${postgis_release}dev.tar.gz" \
  /tmp/postgis.tar.gz

RUN set -eux; \
  tar -xvf /tmp/postgis.tar.gz -C /tmp; \
  rm -rf /tmp/postgis.tar.gz;

# Installer les dépendances de compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libgeos-dev \
  libproj-dev \
  protobuf-c-compiler \
  libprotobuf-c-dev \
  libgdal-dev \
  ;

WORKDIR /tmp/postgis-${postgis_release}dev

RUN ./configure; \
  make -j$(nproc);

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=postgis --pkgversion=${postgis_release} --nodoc

# =============================================================================
# pgRouting
# https://github.com/pgRouting/pgrouting
# pgRouting étend la base de données géospatiale PostGIS / PostgreSQL pour
# fournir une fonctionnalité de routage géospatial.
#
FROM build-pgdev as pgrouting

ARG pgrouting_release=3.6.2
ARG pgrouting_release_checksum=sha256:f4a1ed79d6f714e52548eca3bb8e5593c6745f1bde92eb5fb858efd8984dffa2

ADD --checksum=${pgrouting_release_checksum} \
  "https://github.com/pgRouting/pgrouting/releases/download/v${pgrouting_release}/pgrouting-${pgrouting_release}.tar.gz" \
  /tmp/pgrouting.tar.gz

RUN set -eux; \
  tar -xvf /tmp/pgrouting.tar.gz -C /tmp; \
  rm -rf /tmp/pgrouting.tar.gz;

# Installer les dépendances de compilation
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libboost-all-dev \
  ;

WORKDIR /tmp/pgrouting-${pgrouting_release}/build
RUN cmake -DBUILD_HTML=OFF -DBUILD_DOXY=OFF ..

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=pgrouting --pkgversion=${pgrouting_release} --nodoc


# =============================================================================
# Periods
# https://github.com/xocolatl/periods
# Periods est une extension qui prend en charge les tables temporelles
# versionnées par le système. Les tables temporelles permettent de conserver un
# enregistrement historique des modifications de données dans une table.
#

FROM build-pgdev as periods

ARG periods_release=1.2.2
ARG periods_release_checksum=sha256:36ec2e362df3389bae1591ef837f527554bb8c58be26e2b2481971a492417521

ADD --checksum=${periods_release_checksum} \
  "https://github.com/xocolatl/periods/archive/refs/tags/v${periods_release}.tar.gz" \
  /tmp/periods.tar.gz

RUN set -eux; \
  tar -xvf /tmp/periods.tar.gz -C /tmp; \
  rm -rf /tmp/periods.tar.gz;

WORKDIR /tmp/periods-${periods_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=periods --pkgversion=${periods_release} --nodoc


# =============================================================================
# TimescaleDB

FROM build-pgdev as timescaledb

ARG timescaledb_release=2.13.0
ARG timescaledb_release_checksum=sha256:584a351c7775f0e067eaa0e7277ea88cab9077cc4c455cbbf09a5d9723dce95d

# Download and extract
ADD --checksum=${timescaledb_release_checksum} \
  "https://github.com/timescale/timescaledb/archive/refs/tags/${timescaledb_release}.tar.gz" \
  /tmp/timescaledb.tar.gz

RUN set -eux; \
  tar -xvf /tmp/timescaledb.tar.gz -C /tmp; \
  rm -rf /tmp/timescaledb.tar.gz;

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libkrb5-dev \
  ;

# Build from source
WORKDIR /tmp/timescaledb-${timescaledb_release}
RUN ./bootstrap

WORKDIR /tmp/timescaledb-${timescaledb_release}/build
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=timescaledb --pkgversion=${timescaledb_release} --nodoc


# =============================================================================
# Apache Age
# https://github.com/apache/age

FROM build-pgdev as age

ARG age_release=1.5.0-rc0
ARG age_release_checksum=sha256:7bb4a89661cbcf9a91a332e4e963fd245182be20e540a61a9a2ca0f835a083d8

ADD --checksum=${age_release_checksum} \
  "https://github.com/apache/age/archive/refs/tags/PG16/v${age_release}.tar.gz" \
  /tmp/age.tar.gz

RUN set -eux; \
  tar -xvf /tmp/age.tar.gz -C /tmp; \
  rm -rf /tmp/age.tar.gz;

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  libreadline-dev \
  zlib1g-dev \
  bison \
  flex \
  ;

WORKDIR /tmp/age-PG16-v${age_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=age --nodoc

# =============================================================================
# pgSodium
# https://github.com/michelp/pgsodium
# pgsodium est une extension de bibliothèque de chiffrement pour PostgreSQL
# utilisant la bibliothèque libsodium pour les algorithmes cryptographiques
# de haut niveau.

FROM build-essential as libsodium

ARG libsodium_release=1.0.18
ARG libsodium_release_checksum=sha256:6f504490b342a4f8a4c4a02fc9b866cbef8622d5df4e5452b46be121e46636c1

ADD --checksum=${libsodium_release_checksum} \
  "https://download.libsodium.org/libsodium/releases/libsodium-${libsodium_release}.tar.gz" \
  /tmp/libsodium.tar.gz

RUN tar -xvf /tmp/libsodium.tar.gz -C /tmp && \
  rm -rf /tmp/libsodium.tar.gz

# Build from source
WORKDIR /tmp/libsodium-${libsodium_release}
RUN ./configure; \
  make -j$(nproc); \
  make install;

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --pkgname=libsodium23 --nodoc

FROM libsodium as pgsodium

ARG pgsodium_release=3.1.6
ARG pgsodium_release_checksum=sha256:f46af33b13ce895b3d8eb2c01c2d5b0b6528eab1e51cd624ddc54daea26e230e

ADD --checksum=${pgsodium_release_checksum} \
  "https://github.com/michelp/pgsodium/archive/refs/tags/v${pgsodium_release}.tar.gz" \
  /tmp/pgsodium.tar.gz

RUN tar -xvf /tmp/pgsodium.tar.gz -C /tmp && \
  rm -rf /tmp/pgsodium.tar.gz

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
  postgresql-server-dev-16 \
  ;

# Build from source
WORKDIR /tmp/pgsodium-${pgsodium_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --requires=libsodium23 --nodoc

# =============================================================================
# pgVector
FROM build-pgdev as pgvector

ARG pgvector_release=0.6.2
ARG pgvector_release_checksum=sha256:a11cc249a9f3f3d7b13069a1696f2915ac28991a72d7ba4e2bcfdceddbaeae49

ADD --checksum=${pgvector_release_checksum} \
  "https://github.com/pgvector/pgvector/archive/refs/tags/v${pgvector_release}.tar.gz" \
  /tmp/pgvector.tar.gz

RUN tar -xvf /tmp/pgvector.tar.gz -C /tmp && \
  rm -rf /tmp/pgvector.tar.gz

# Build from source
WORKDIR /tmp/pgvector-${pgvector_release}
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --nodoc

# =============================================================================
# postgresql-anonymizer
FROM build-pgdev as pganon

ARG anon_release=1.3.2
ARG anon_release_checksum=sha256:4a7238e71cf6ea4cf492cdc4bd3fd9b76bbdc4053d5dd696ba3fe1fa2ab3c318

ADD --checksum=${anon_release_checksum} \
  "https://gitlab.com/dalibo/postgresql_anonymizer/-/archive/${anon_release}/postgresql_anonymizer-${anon_release}.tar.gz" \
  /tmp/anon.tar.gz

  RUN mkdir /tmp/anon && \
  tar -xvf /tmp/anon.tar.gz -C /tmp && \
  rm -rf /tmp/anon.tar.gz

# edit make to french data

WORKDIR /tmp/postgresql_anonymizer-1.3.2
RUN make -j$(nproc)

# Create debian package
RUN checkinstall -D --install=no --fstrans=no --backup=no --pakdir=/tmp --nodoc

# =============================================================================
# Image finale de production
#
FROM debian:bookworm-slim as production

# explicitly set user/group IDs
RUN set -eux; \
	groupadd -r postgres --gid=999; \
# https://salsa.debian.org/postgresql/postgresql-common/blob/997d842ee744687d99a2b2d95c1083a2615c79e8/debian/postgresql-common.postinst#L32-35
	useradd -r -g postgres --uid=999 --home-dir=/var/lib/postgresql --shell=/bin/bash postgres; \
# also create the postgres user's home directory with appropriate permissions
# see https://github.com/docker-library/postgres/issues/274
	mkdir -p /var/lib/postgresql; \
	chown -R postgres:postgres /var/lib/postgresql

RUN set -ex; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		gnupg \
# https://www.postgresql.org/docs/16/app-psql.html#APP-PSQL-META-COMMAND-PSET-PAGER
# https://github.com/postgres/postgres/blob/REL_16_1/src/include/fe_utils/print.h#L25
# (if "less" is available, it gets used as the default pager for psql, and it only adds ~1.5MiB to our image size)
		less \
	; \
	rm -rf /var/lib/apt/lists/*

# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
# ENV GOSU_VERSION 1.17
# RUN set -eux; \
# 	savedAptMark="$(apt-mark showmanual)"; \
# 	apt-get update; \
# 	apt-get install -y --no-install-recommends ca-certificates wget; \
# 	rm -rf /var/lib/apt/lists/*; \
# 	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
# 	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
# 	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
# 	export GNUPGHOME="$(mktemp -d)"; \
# 	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
# 	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
# 	gpgconf --kill all; \
# 	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
# 	apt-mark auto '.*' > /dev/null; \
# 	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
# 	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
# 	chmod +x /usr/local/bin/gosu; \
# 	gosu --version; \
# 	gosu nobody true

ADD --chmod=755 \
  https://github.com/tianon/gosu/releases/download/1.16/gosu-amd64 \
  /usr/local/bin/gosu


# make the "fr_FR.UTF-8" locale so postgres will be utf-8 enabled by default
RUN set -eux; \
	if [ -f /etc/dpkg/dpkg.cfg.d/docker ]; then \
# if this file exists, we're likely in "debian:xxx-slim", and locales are thus being excluded so we need to remove that exclusion (since we need locales)
		grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
		sed -ri '/\/usr\/share\/locale/d' /etc/dpkg/dpkg.cfg.d/docker; \
		! grep -q '/usr/share/locale' /etc/dpkg/dpkg.cfg.d/docker; \
	fi; \
	apt-get update; apt-get install -y --no-install-recommends locales; rm -rf /var/lib/apt/lists/*; \
	echo 'fr_FR.UTF-8 UTF-8' >> /etc/locale.gen; \
	locale-gen; \
	locale -a | grep 'fr_FR.utf8'
ENV LANG fr_FR.utf8

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		libnss-wrapper \
		xz-utils \
		zstd \
	; \
	rm -rf /var/lib/apt/lists/*

RUN mkdir /docker-entrypoint-initdb.d

RUN set -ex; \
# pub   4096R/ACCC4CF8 2011-10-13 [expires: 2019-07-02]
#       Key fingerprint = B97B 0AFC AA1A 47F0 44F2  44A0 7FCC 7D46 ACCC 4CF8
# uid                  PostgreSQL Debian Repository
	key='B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8'; \
	export GNUPGHOME="$(mktemp -d)"; \
	mkdir -p /usr/local/share/keyrings/; \
	gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key"; \
	gpg --batch --export --armor "$key" > /usr/local/share/keyrings/postgres.gpg.asc; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME"

ENV PG_MAJOR 16
ENV PATH $PATH:/usr/lib/postgresql/$PG_MAJOR/bin

ENV PG_VERSION 16.2-1.pgdg120+2

RUN set -ex; \
	\
# see note below about "*.pyc" files
	export PYTHONDONTWRITEBYTECODE=1; \
	\
	dpkgArch="$(dpkg --print-architecture)"; \
	aptRepo="[ signed-by=/usr/local/share/keyrings/postgres.gpg.asc ] http://apt.postgresql.org/pub/repos/apt/ bookworm-pgdg main $PG_MAJOR"; \
	case "$dpkgArch" in \
		amd64 | arm64 | ppc64el | s390x) \
# arches officialy built by upstream
			echo "deb $aptRepo" > /etc/apt/sources.list.d/pgdg.list; \
			apt-get update; \
			;; \
		*) \
# we're on an architecture upstream doesn't officially build for
# let's build binaries from their published source packages
			echo "deb-src $aptRepo" > /etc/apt/sources.list.d/pgdg.list; \
			\
			savedAptMark="$(apt-mark showmanual)"; \
			\
			tempDir="$(mktemp -d)"; \
			cd "$tempDir"; \
			\
# create a temporary local APT repo to install from (so that dependency resolution can be handled by APT, as it should be)
			apt-get update; \
			apt-get install -y --no-install-recommends dpkg-dev; \
			echo "deb [ trusted=yes ] file://$tempDir ./" > /etc/apt/sources.list.d/temp.list; \
			_update_repo() { \
				dpkg-scanpackages . > Packages; \
# work around the following APT issue by using "Acquire::GzipIndexes=false" (overriding "/etc/apt/apt.conf.d/docker-gzip-indexes")
#   Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
#   ...
#   E: Failed to fetch store:/var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages  Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
				apt-get -o Acquire::GzipIndexes=false update; \
			}; \
			_update_repo; \
			\
# build .deb files from upstream's source packages (which are verified by apt-get)
			nproc="$(nproc)"; \
			export DEB_BUILD_OPTIONS="nocheck parallel=$nproc"; \
# we have to build postgresql-common first because postgresql-$PG_MAJOR shares "debian/rules" logic with it: https://salsa.debian.org/postgresql/postgresql/-/commit/99f44476e258cae6bf9e919219fa2c5414fa2876
# (and it "Depends: pgdg-keyring")
			apt-get build-dep -y postgresql-common pgdg-keyring; \
			apt-get source --compile postgresql-common pgdg-keyring; \
			_update_repo; \
			apt-get build-dep -y "postgresql-$PG_MAJOR=$PG_VERSION"; \
			apt-get source --compile "postgresql-$PG_MAJOR=$PG_VERSION"; \
			\
# we don't remove APT lists here because they get re-downloaded and removed later
			\
# reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
# (which is done after we install the built packages so we don't have to redownload any overlapping dependencies)
			apt-mark showmanual | xargs apt-mark auto > /dev/null; \
			apt-mark manual $savedAptMark; \
			\
			ls -lAFh; \
			_update_repo; \
			grep '^Package: ' Packages; \
			cd /; \
			;; \
	esac; \
	\
	apt-get install -y --no-install-recommends postgresql-common; \
	sed -ri 's/#(create_main_cluster) .*$/\1 = false/' /etc/postgresql-common/createcluster.conf; \
	apt-get install -y --no-install-recommends \
		"postgresql-$PG_MAJOR=$PG_VERSION" \
	; \
	\
	rm -rf /var/lib/apt/lists/*; \
	\
	if [ -n "$tempDir" ]; then \
# if we have leftovers from building, let's purge them (including extra, unnecessary build deps)
		apt-get purge -y --auto-remove; \
		rm -rf "$tempDir" /etc/apt/sources.list.d/temp.list; \
	fi; \
	\
# some of the steps above generate a lot of "*.pyc" files (and setting "PYTHONDONTWRITEBYTECODE" beforehand doesn't propagate properly for some reason), so we clean them up manually (as long as they aren't owned by a package)
	find /usr -name '*.pyc' -type f -exec bash -c 'for pyc; do dpkg -S "$pyc" &> /dev/null || rm -vf "$pyc"; done' -- '{}' +; \
	\
	postgres --version

# make the sample config easier to munge (and "correct by default")
RUN set -eux; \
	dpkg-divert --add --rename --divert "/usr/share/postgresql/postgresql.conf.sample.dpkg" "/usr/share/postgresql/$PG_MAJOR/postgresql.conf.sample"; \
	cp -v /usr/share/postgresql/postgresql.conf.sample.dpkg /usr/share/postgresql/postgresql.conf.sample; \
	ln -sv ../postgresql.conf.sample "/usr/share/postgresql/$PG_MAJOR/"; \
	sed -ri "s!^#?(listen_addresses)\s*=\s*\S+.*!\1 = '*'!" /usr/share/postgresql/postgresql.conf.sample; \
	grep -F "listen_addresses = '*'" /usr/share/postgresql/postgresql.conf.sample

RUN mkdir -p /var/run/postgresql && chown -R postgres:postgres /var/run/postgresql && chmod 3777 /var/run/postgresql

ENV PGDATA /var/lib/postgresql/data
# this 1777 will be replaced by 0700 at runtime (allows semi-arbitrary "--user" values)
RUN mkdir -p "$PGDATA" && chown -R postgres:postgres "$PGDATA" && chmod 1777 "$PGDATA"
VOLUME /var/lib/postgresql/data

# Extensions

COPY --from=postgis /tmp/*.deb /tmp
COPY --from=pgrouting /tmp/*.deb /tmp
COPY --from=timescaledb /tmp/*.deb /tmp
COPY --from=age /tmp /tmp
COPY --from=periods /tmp/*.deb /tmp
COPY --from=pgvector /tmp/*.deb /tmp
COPY --from=pgsodium /tmp/*.deb /tmp
COPY --from=pganon /tmp/*.deb /tmp

RUN set -eux; \
  apt-get install \
    /tmp/*.deb \
  -y;

RUN echo "shared_preload_libraries = 'timescaledb'" >> /usr/share/postgresql/$PG_MAJOR/postgresql.conf.sample

# Entrypoint

#COPY docker-entrypoint.sh docker-ensure-initdb.sh /usr/local/bin/

ADD --chmod=0755 \
  https://github.com/docker-library/postgres/raw/master/16/bookworm/docker-entrypoint.sh \
  /usr/local/bin/

ADD --chmod=0755 \
  https://github.com/docker-library/postgres/raw/master/16/bookworm/docker-ensure-initdb.sh \
  /usr/local/bin/

RUN ln -sT docker-ensure-initdb.sh /usr/local/bin/docker-enforce-initdb.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# We set the default STOPSIGNAL to SIGINT, which corresponds to what PostgreSQL
# calls "Fast Shutdown mode" wherein new connections are disallowed and any
# in-progress transactions are aborted, allowing PostgreSQL to stop cleanly and
# flush tables to disk, which is the best compromise available to avoid data
# corruption.
#
# Users who know their applications do not keep open long-lived idle connections
# may way to use a value of SIGTERM instead, which corresponds to "Smart
# Shutdown mode" in which any existing sessions are allowed to finish and the
# server stops when all sessions are terminated.
#
# See https://www.postgresql.org/docs/12/server-shutdown.html for more details
# about available PostgreSQL server shutdown signals.
#
# See also https://www.postgresql.org/docs/12/server-start.html for further
# justification of this as the default value, namely that the example (and
# shipped) systemd service files use the "Fast Shutdown mode" for service
# termination.
#
STOPSIGNAL SIGINT
#
# An additional setting that is recommended for all users regardless of this
# value is the runtime "--stop-timeout" (or your orchestrator/runtime's
# equivalent) for controlling how long to wait between sending the defined
# STOPSIGNAL and sending SIGKILL (which is likely to cause data corruption).
#
# The default in most runtimes (such as Docker) is 10 seconds, and the
# documentation at https://www.postgresql.org/docs/12/server-start.html notes
# that even 90 seconds may not be long enough in many instances.

HEALTHCHECK --interval=2s --timeout=2s --retries=10 CMD pg_isready -U postgres -h localhost

EXPOSE 5432
CMD ["postgres"]
