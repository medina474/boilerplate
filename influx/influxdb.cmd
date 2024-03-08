@echo off
echo === InfluxDB

docker pull influxdb:alpine

docker run ^
--name=influxdb-neotech ^
--volume influxdb-data-neotech:/var/lib/influxdb2  ^
--volume influxdb-config-neotech:/etc/influxdb2 ^
-p 0.0.0.0:8086:8086 ^
--net neotech-net ^
--ip 192.168.0.106 ^
--dns 192.168.137.2 ^
-e DOCKER_INFLUXDB_INIT_MODE=setup  ^
-e DOCKER_INFLUXDB_INIT_USERNAME=admin  ^
-e DOCKER_INFLUXDB_INIT_PASSWORD=2XAoihMmmhuMPT9eVeBB  ^
-e DOCKER_INFLUXDB_INIT_ORG=neotech  ^
-e DOCKER_INFLUXDB_INIT_BUCKET=raspberry  ^
-e DOCKER_INFLUXDB_INIT_RETENTION=3w  ^
-e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=6z9WSEAO6iRJavs7CIklSYWeJ70EZN0K  ^
-d influxdb:alpine

