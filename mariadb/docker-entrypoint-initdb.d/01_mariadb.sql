-- exporter
create user 'exporter'@'%' identified by 'motdepasse' with max_user_connections 2;
grant process, replication client, slave monitor, select on *.* to 'exporter'@'%';

-- phpMyAdmin
create user 'pma'@'%' identified by 'motdepasse';
create database phpmyadmin;
grant all privileges on `phpmyadmin`.* to 'pma'@'%';

-- Se connecter à phpMyAdmin avec le compte pma, Aller sur l'onglet Opérations de la table phpmyadmin
-- Créer le stockage de configurations phpMyAdmin dans la base de données active.
