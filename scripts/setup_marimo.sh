#!/bin/bash

rm -rf $PWD/iceberg-data

mkdir -p $PWD/iceberg-data

cd iceberg-data

uv venv

source .venv/bin/activate

uv pip install marimo pyarrow pyiceberg pandas

