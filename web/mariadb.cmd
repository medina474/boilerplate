@echo off
echo === MariaDB

docker pull mariadb:latest

docker run ^
--name mariadb-neotech ^
--volume mariadb-neotech:/var/lib/mysql ^
-p 0.0.0.0:3306:3306 ^
--net neotech-net ^
--ip 192.168.0.102 ^
--dns 192.168.137.2 ^
-e MARIADB_ROOT_PASSWORD=A1Zrhp8YYljYMObEJccM ^
-d mariadb:latest