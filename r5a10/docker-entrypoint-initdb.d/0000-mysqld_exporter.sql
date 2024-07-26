create user 'exporter'@'localhost' identified by 'motdepasse' with max_user_connections 3;
grant process, replication client, slave monitor, select on *.* to 'exporter'@'localhost';
