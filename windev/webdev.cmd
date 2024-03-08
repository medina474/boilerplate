@echo off
echo === PCSoft - WebDev

docker pull windev/webdev:FR280051n

docker run -dit ^
--restart unless-stopped ^
--name webdev-neotech ^
--volume webdev-neotech:/var/lib/WEBDEV/26.0/ ^
--publish 9008:80 ^
windev/webdev:FR280051n
