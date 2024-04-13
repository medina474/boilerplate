docker pull grafana/k6

docker run --network=boilerplate_network --rm -i grafana/k6 run - <scripts\single-request.js


https://grafana.com/docs/k6/latest/results-output/real-time/influxdb/