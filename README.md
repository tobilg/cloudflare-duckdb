# cloudflare-duckdb
Running DuckDB on Cloudflare Containers

## Build image locally
You can run 

```bash
docker build -t tobilg/cloudflare-duckdb . 
```

to build the image locally.

## Run the image locally
To run the image locally, run

```bash
docker run --rm -it -p 3000:3000 tobilg/cloudflare-duckdb 
```

To query the DuckDb API within the running container, use

```bash
curl --location 'http://localhost:3000/query' \
--header 'Content-Type: application/json' \
--data '{
    "query": "SELECT * FROM '\''https://shell.duckdb.org/data/tpch/0_01/parquet/orders.parquet'\'' LIMIT 1000"
}'
```
