#!/bin/bash

rm -rf $PWD/extensions
mkdir -p $PWD/extensions

# Download extensions
curl -s http://extensions.duckdb.org/v1.2.1/linux_amd64/httpfs.duckdb_extension.gz --output $PWD/extensions/httpfs.duckdb_extension.gz
curl -s http://extensions.duckdb.org/v1.2.1/linux_amd64/json.duckdb_extension.gz --output $PWD/extensions/json.duckdb_extension.gz
curl -s http://extensions.duckdb.org/v1.2.1/linux_amd64/arrow.duckdb_extension.gz --output $PWD/extensions/arrow.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.1/linux_amd64/iceberg.duckdb_extension.gz --output $PWD/extensions/iceberg.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.1/linux_amd64/avro.duckdb_extension.gz --output $PWD/extensions/avro.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.1/linux_amd64/aws.duckdb_extension.gz --output $PWD/extensions/aws.duckdb_extension.gz

# Unzip
gunzip $PWD/extensions/httpfs.duckdb_extension.gz
gunzip $PWD/extensions/json.duckdb_extension.gz
gunzip $PWD/extensions/arrow.duckdb_extension.gz
gunzip $PWD/extensions/iceberg.duckdb_extension.gz
gunzip $PWD/extensions/avro.duckdb_extension.gz
gunzip $PWD/extensions/aws.duckdb_extension.gz