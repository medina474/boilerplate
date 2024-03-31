Minio
MinIO is a high-performance, S3 compatible object store. It is built for large scale AI/ML,
data lake and database workloads. It is software-defined and runs on any cloud or on-premises infrastructure.


  # Create a service that only creates a default bucket.
  # /usr/bin/mc policy set download minio1/loki;
  # /usr/bin/mc admin update minio1 --yes;
  minio_init:
    container_name: minio_init
    image: minio/mc
    depends_on:
      - minio
    entrypoint: >
      /bin/sh -c "
      /usr/bin/mc config host add minio1 http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD};
      /usr/bin/mc rm -r --force minio1/loki;
      /usr/bin/mc mb minio1/loki;
      /usr/bin/mc policy set public minio1/loki;
      /usr/bin/mc admin prometheus generate minio1 bucket --public;
      /usr/bin/mc admin info minio1;
      exit 0;
      "
    networks:
      - proxy_internal
