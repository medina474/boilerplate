-- exporter
create user 'exporter'@'localhost' identified by 'myPassword' with max_user_connections 3;
grant process, replication client, select on *.* to 'exporter'@'localhost';

-- phpMyAdmin
create database phpmyadmin;
