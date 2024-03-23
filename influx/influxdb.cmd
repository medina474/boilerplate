docker run ^
--name=influxdb-neotech ^
--volume influxdb-data-neotech:/var/lib/influxdb2  ^
--volume influxdb-config-neotech:/etc/influxdb2 ^

--net neotech-net ^
--ip 192.168.0.106 ^
--dns 192.168.137.2 ^

-d influxdb:alpine
