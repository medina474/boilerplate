create database if not exists tp1;
use tp1;

-- 
create table if not exists `villes` (
  `id` int(10) unsigned not null auto_increment,
  `nom` varchar(100),
  `coordonnees` point not null,
  primary key (`id`),
  spatial index(coordonnees)
) engine=myisam;

create table if not exists `routes` (
  `id` int(10) unsigned not null auto_increment,
  `nom` varchar(100),
  `coordonnees` linestring not null,
  primary key (`id`),
  spatial index(coordonnees)
) engine=myisam;

create table if not exists `quartiers` (
  `id` int(10) unsigned not null auto_increment,
  `nom` varchar(100),
  `coordonnees` polygon not null,
  primary key (`id`),
  spatial index(coordonnees)
) engine=myisam;

---
truncate table `villes`;

insert into `villes` (nom, coordonnees) values 
  ('Rochebrune',PointFromText('point(10 10)')),
  ('Beaufort-sur-Mer',PointFromText('point(5 20)')),
  ('Saint-Éloi-de-Champs',PointFromText('point(25 5)')),
  ('Pont-des-Lys',PointFromText('point(20 15)')),
  ('Pépinville',PointFromText('point(28 11)'));

truncate table `routes`;

insert into `routes` (nom, coordonnees) values 
('route AB', ST_GeomFromText('LINESTRING(10 10, 5 20)')),
('route AD', ST_GeomFromText('LINESTRING(10 10, 20 15)')),
('route AC', ST_GeomFromText('LINESTRING(10 10, 25 5)')),
('route DC', ST_GeomFromText('LINESTRING(20 15, 25 5)')),
('route CE', ST_GeomFromText('LINESTRING(25 5, 28 11)')),
('route DE', ST_GeomFromText('LINESTRING(28 11, 20 15)')),
('route BC', ST_GeomFromText('LINESTRING(5 20, 25 5)'));

truncate table `quartiers`;

--

-- Quelles sont les villes les plus proches
select v1.nom, v2.nom, 
  ST_Distance(v1.coordonnees,v2.coordonnees) as d
from villes v1
join villes v2 on v2.id < v1.id order by d asc limit 1;
