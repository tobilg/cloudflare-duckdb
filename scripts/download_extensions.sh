#!/bin/bash

rm -rf $PWD/extensions
mkdir -p $PWD/extensions

# Download extensions
curl -s http://extensions.duckdb.org/v1.2.2/linux_amd64_gcc4/httpfs.duckdb_extension.gz --output $PWD/extensions/httpfs.duckdb_extension.gz
curl -s http://extensions.duckdb.org/v1.2.2/linux_amd64_gcc4/json.duckdb_extension.gz --output $PWD/extensions/json.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.2/linux_amd64_gcc4/iceberg.duckdb_extension.gz --output $PWD/extensions/iceberg.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.2/linux_amd64_gcc4/avro.duckdb_extension.gz --output $PWD/extensions/avro.duckdb_extension.gz
curl -s http://nightly-extensions.duckdb.org/v1.2.2/linux_amd64_gcc4/aws.duckdb_extension.gz --output $PWD/extensions/aws.duckdb_extension.gz

# Unzip
gunzip $PWD/extensions/httpfs.duckdb_extension.gz
gunzip $PWD/extensions/json.duckdb_extension.gz
gunzip $PWD/extensions/iceberg.duckdb_extension.gz
gunzip $PWD/extensions/avro.duckdb_extension.gz
gunzip $PWD/extensions/aws.duckdb_extension.gz