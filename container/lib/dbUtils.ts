import { DuckDBConnection, DuckDBInstance, DuckDBValue } from '@duckdb/node-api';
import { filterQuery } from './queryFilter';

export const createConnection = async () => {
  // Instantiate DuckDB
  const duckDB = await DuckDBInstance.create(':memory:', {});

  // Create connection
  const connection = await duckDB.connect();

  return connection;
}

export const query = async (connection: DuckDBConnection, query: string, filteringEnabled = true): Promise<Record<string, DuckDBValue>[]> => {
  const reader = await connection.runAndReadAll(filterQuery(query, filteringEnabled));
  return reader.getRowObjects();
}

export const initialize = async (connection: DuckDBConnection) => {
  // Load home directory
  await query(connection, `SET home_directory='/tmp';`, false);

  await query(connection, 'INSTALL \'/app/extensions/httpfs.duckdb_extension\';', false);
  await query(connection, 'LOAD \'/app/extensions/httpfs.duckdb_extension\';', false);

  if (process.env.R2_TOKEN && process.env.R2_ENDPOINT && process.env.R2_CATALOG) {
    // Load iceberg extension
    await query(connection, 'INSTALL \'/app/extensions/avro.duckdb_extension\';', false);
    await query(connection, 'LOAD \'/app/extensions/avro.duckdb_extension\';', false);
    await query(connection, 'INSTALL \'/app/extensions/iceberg.duckdb_extension\';', false);
    await query(connection, 'LOAD \'/app/extensions/iceberg.duckdb_extension\';', false);

    // Create secrets
    await query(connection, `CREATE OR REPLACE SECRET r2_catalog_secret (TYPE ICEBERG, TOKEN '${process.env.R2_TOKEN}', ENDPOINT '${process.env.R2_ENDPOINT}');`, false);
    // Attach catalog
    await query(connection, `ATTACH '${process.env.R2_CATALOG}' AS r2_datalake (TYPE ICEBERG, ENDPOINT '${process.env.R2_ENDPOINT}');`, false);
  } 

  // Whether or not the global http metadata is used to cache HTTP metadata, see https://github.com/duckdb/duckdb/pull/5405
  await query(connection, 'SET enable_http_metadata_cache=true;', false);

  // Whether or not object cache is used to cache e.g. Parquet metadata
  await query(connection, 'SET enable_object_cache=true;', false);

  // Whether or not version guessing is enabled
  await query(connection, 'SET unsafe_enable_version_guessing=true;', false);

  // Lock the local file system
  await query(connection, `SET disabled_filesystems = 'LocalFileSystem';`, false);

  // Lock the configuration
  await query(connection, `SET lock_configuration=true;`, false);
};
