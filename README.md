## Redis
https://redis.io/fr/

### Dragonfly
https://www.dragonflydb.io/

### KeyDB
https://docs.keydb.dev/

### Valkey
https://valkey.io/


## Docker

```
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "log-driver": "gelf",
  "log-opts": {
    "gelf-address": "udp://192.168.137.177:12201"
  },
  "metrics-addr": "127.0.0.1:9323"
}
```
