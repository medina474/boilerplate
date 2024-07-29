FROM redhat/ubi9-minimal

# Utilisateur mysql
RUN groupadd --gid 999 -r mysql && \
	useradd -r -g mysql mysql --home-dir /var/lib/mysql --uid 999

ADD --chmod=0755 \
  https://github.com/tianon/gosu/releases/download/1.17/gosu-amd64 \
  /usr/local/bin/gosu

RUN set -eux; \
	gosu --version; \
 	gosu nobody true
	
COPY docker.cnf /etc/my.cnf.d/

COPY MariaDB.repo /etc/yum.repos.d/

# bashbrew-architectures: amd64 arm64v8 ppc64le s390x
ARG MARIADB_VERSION=11.4.2
# release-status:Stable
# release-support-type:Long Term Support
# (https://downloads.mariadb.org/rest-api/mariadb/)

# missing pwgen(epel), jemalloc(epel) (as entrypoint/user extensions)
# procps, pv(epel) - missing dependencies of galera sst script
# tzdata re-installed as only a fake version is part of the ubi-minimal base image.
# FF8AD1344597106ECE813B918A3872BF3228467C is the Fedora RPM key
# 177F4010FE56CA3336300305F1656F24C74CD1D8 is the MariaDB Server RPM key
RUN set -eux ; \
	curl --fail https://pagure.io/fedora-web/websites/raw/master/f/sites/getfedora.org/static/keys/FF8AD1344597106ECE813B918A3872BF3228467C.txt --output /tmp/epelkey.txt ; \
	GNUPGHOME="$(mktemp -d)"; export GNUPGHOME ; \
	gpg --batch --import /tmp/epelkey.txt ; \
	gpg --batch --armor --export FF8AD1344597106ECE813B918A3872BF3228467C > /tmp/epelkey.txt ; \
	rpmkeys --import /tmp/epelkey.txt ; \
	curl --fail https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm --output /tmp/epel-release-latest-9.noarch.rpm ; \
	rpm -K /tmp/epel-release-latest-9.noarch.rpm ; \
	rpm -ivh /tmp/epel-release-latest-9.noarch.rpm ; \
	rm /tmp/epelkey.txt /tmp/epel-release-latest-9.noarch.rpm ; \
	curl --fail https://supplychain.mariadb.com/MariaDB-Server-GPG-KEY --output /tmp/MariaDB-Server-GPG-KEY ; \
	gpg --batch --import /tmp/MariaDB-Server-GPG-KEY; \
	gpg --batch --armor --export 177F4010FE56CA3336300305F1656F24C74CD1D8 > /tmp/MariaDB-Server-GPG-KEY ; \
	rpmkeys --import /tmp/MariaDB-Server-GPG-KEY ; \
	rm -rf "$GNUPGHOME" /tmp/MariaDB-Server-GPG-KEY ; \
	unset GNUPGHOME ; \
	microdnf update -y ; \
	microdnf reinstall -y tzdata ; \
	microdnf install -y procps-ng zstd xz jemalloc pwgen pv ; \
	mkdir -p /etc/mysql/conf.d /etc/mysql/mariadb.conf.d/ /var/lib/mysql/mysql /run/mariadb /usr/lib64/galera ; \
	chmod ugo+rwx,o+t /run/mariadb ; \
	microdnf install -y MariaDB-backup-11.4.2 MariaDB-server-11.4.2 ; \
	# compatibility with DEB Galera packaging
	ln -s /usr/lib64/galera-4/libgalera_smm.so /usr/lib/libgalera_smm.so ; \
	# compatibility with RPM Galera packaging
	ln -s /usr/lib64/galera-4/libgalera_smm.so /usr/lib64/galera/libgalera_smm.so ; \
	microdnf clean all ; \
	rmdir /var/lib/mysql/mysql ; \
	chown -R mysql:mysql /var/lib/mysql /run/mariadb ; 

VOLUME /var/lib/mysql

RUN mkdir /docker-entrypoint-initdb.d

COPY healthcheck.sh /usr/local/bin/
COPY docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3306
CMD ["mariadbd"]
