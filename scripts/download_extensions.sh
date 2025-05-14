#!/bin/bash

mkdir -p $PWD/extensions

# Download extensions
curl http://extensions.duckdb.org/v1.2.1/linux_amd64/httpfs.duckdb_extension.gz --output $PWD/extensions/httpfs.duckdb_extension.gz
curl http://extensions.duckdb.org/v1.2.1/linux_amd64/json.duckdb_extension.gz --output $PWD/extensions/json.duckdb_extension.gz
curl http://extensions.duckdb.org/v1.2.1/linux_amd64/arrow.duckdb_extension.gz --output $PWD/extensions/arrow.duckdb_extension.gz

# Unzip
gunzip $PWD/extensions/httpfs.duckdb_extension.gz
gunzip $PWD/extensions/json.duckdb_extension.gz
gunzip $PWD/extensions/arrow.duckdb_extension.gz
