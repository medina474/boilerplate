# Graylog

https://go2docs.graylog.org/5-2/downloading_and_installing_graylog/debian_installation.htm?tocpath=Downloading%20and%20Installing%20Graylog%7CInstalling%20Graylog%7C_____4

## MongoDB

### libssl1.1

You can install MongoDB from the “bullseye” (Debian 11) repository on Debian 12, but you’ll need to also add bullseye to your sources.list to get the libssl1.1 package on which it depends (Debian 12 provides libssl3 which is not ABI-compatible with libssl1.1).
It’s a bit hackish but it does work well in my own tests (and is simpler than recompiling or going through a container).

Ajouter dans le fichier /etc/apt/sources.list

```
deb http://deb.debian.org/debian bullseye main
```

apt update
apt install libssl1.1

### Ajouter le dépôt

Download the key

wget https://www.mongodb.org/static/pgp/server-6.0.asc

mv server-6.0.asc /etc/apt/keyrings/mongodb.asc

Edit the file /etc/apt/sources.list.d/mongodb.list, add

deb [signed-by=/etc/apt/keyrings/<your-keyfile-name>.gpg] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main

Now apt will accept that key's signature for all packages in that repo and only that repo.

apt update
apt install mongodb-org

systemctl daemon-reload
systemctl enable mongod.service
systemctl restart mongod.service
systemctl --type=service --state=active | grep mongod

## OpenSearch

### Ajouter le dépôt

wget https://artifacts.opensearch.org/publickeys/opensearch.pgp

mv opensearch.pgp /etc/apt/keyrings/

Edit the file /etc/apt/sources.list.d/opensearch.list, add

deb [signed-by=/etc/apt/keyrings/opensearch.pgp] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main

apt update

OPENSEARCH_INITIAL_ADMIN_PASSWORD=$(tr -dc A-Z-a-z-0-9_@#%^-_=+ < /dev/urandom  | head -c${1:-32}) apt-get install opensearch

### Configuration

nano /etc/opensearch/opensearch.yml

```
cluster.name: graylog
node.name: ${HOSTNAME}
network.host: 0.0.0.0
discovery.type: single-node
plugins.security.disabled: true

??
action.auto_create_index: false
indices.query.bool.max_clause_count: 32768
```

Enable JVM options

nano /etc/opensearch/jvm.options

Now, update the Xms and Xmx settings with **half of the installed system memory**, like shown in the example below.

### Configure the kernel parameters at runtime.

Copy
sudo sysctl -w vm.max_map_count=262144
sudo echo 'vm.max_map_count=262144' >> /etc/sysctl.conf

sudo systemctl daemon-reload
sudo systemctl enable opensearch.service
sudo systemctl start opensearch.service
sudo systemctl status opensearch

## Install Graylog

wget https://packages.graylog2.org/repo/packages/graylog-5.2-repository_latest.deb
dpkg -i graylog-5.2-repository_latest.deb
apt update && apt install graylog-server

### Edit the Configuration File

/etc/graylog/server/server.conf. Additionally, add password_secret and root_password_sha2 as these are mandatory and Graylog will not start without them.

To be able to connect to Graylog, you should set http_bind_address to the public host name or a public IP address for the machine with which you can connect
http_bind_address = 192.168.137.89:9000

It is necessary in Graylog 5.2 to manually adjust the elasticsearch_hosts setting to include a list of comma-separated URIs to one or more valid
elasticsearch_hosts = http://127.0.0.1:9200

### Configuration
Menu System - Inputs

Add GELF UDP
