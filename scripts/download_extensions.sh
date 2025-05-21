#!/bin/bash

rm -rf $PWD/extensions
mkdir -p $PWD/extensions

# Download extensions
curl http://extensions.duckdb.org/v1.3.0/linux_amd64/httpfs.duckdb_extension.gz --output $PWD/extensions/httpfs.duckdb_extension.gz
curl http://extensions.duckdb.org/v1.3.0/linux_amd64/iceberg.duckdb_extension.gz --output $PWD/extensions/iceberg.duckdb_extension.gz
curl http://extensions.duckdb.org/v1.3.0/linux_amd64/avro.duckdb_extension.gz --output $PWD/extensions/avro.duckdb_extension.gz

# Unzip
gunzip $PWD/extensions/httpfs.duckdb_extension.gz
gunzip $PWD/extensions/iceberg.duckdb_extension.gz
gunzip $PWD/extensions/avro.duckdb_extension.gz
