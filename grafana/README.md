
https://github.com/docker/awesome-compose/tree/master/prometheus-grafana

https://github.com/stefanprodan/dockprom

https://yoandev.co/superviser-ses-conteneurs-docker-avec-prometheus/grafana-et-stressons-la-solution-avec-une-api-symfony-et-postman/

https://hackernoon.com/fr/comment-d%C3%A9ployer-grafana-loki-et-enregistrer-des-donn%C3%A9es-sur-minio-%C3%A0-l'aide-de-conteneurs-docker-ou-directement-depuis-la-source

https://blog.min.io/how-to-grafana-loki-minio/

https://github.com/cniackz/loki?ref=blog.min.io

### Générer des logs

```yaml
```

PostgreSQL

Database user permissions (Important!)
The database user you specify when you add the data source should only be granted SELECT permissions on the specified database and tables you want to query. Grafana does not validate that the query is safe. The query could include any SQL statement. For example, statements like DELETE FROM user; and DROP TABLE user; would be executed. To protect against this we highly recommend you create a specific PostgreSQL user with restricted permissions.

 CREATE USER grafana WITH PASSWORD 'supermotdepasse';
 GRANT USAGE ON SCHEMA public TO grafana;
 GRANT SELECT ON public.table TO grafana;
