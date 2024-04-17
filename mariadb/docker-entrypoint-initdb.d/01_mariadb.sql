-- exporter
create user 'exporter'@'%' identified by 'myPassword' with max_user_connections 2;
grant process, replication client, slave monitor, select on *.* to 'exporter'@'%';

-- phpMyAdmin
create database phpmyadmin;
