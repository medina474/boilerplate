@echo off
echo === Grafana

docker pull grafana/grafana:latest

docker run ^
--name=grafana-neotech ^
-p 0.0.0.0:3000:3000 ^
--net neotech-net ^
--ip 192.168.0.100 ^
--dns 192.168.137.2 ^
-d grafana/grafana:latest

::-p 0.0.0.0:9000:3000 ^