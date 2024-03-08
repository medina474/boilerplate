@echo off
echo === MongoDB

docker pull mongo:latest

docker run ^
--name mongodb-iutsd ^
--volume mongo-config-iutsd:/data/configdb ^
--volume mongo-db-iutsd:/data/db ^
-p 0.0.0.0:9003:27017 ^
--net iutsd-net ^
--ip 192.168.0.103 ^
--dns 172.16.6.177 ^
-e MONGO_INITDB_ROOT_USERNAME=root ^
-e MONGO_INITDB_ROOT_PASSWORD=ivfGUPFKsB97y7ka9zsZ ^
-d mongo:latest
