import { DuckDBConnection, DuckDBInstance, DuckDBMaterializedResult} from '@duckdb/node-api';
import { filterQuery } from './queryFilter';

export const createConnection = async () => {
  // Instantiate DuckDB
  const duckDB = await DuckDBInstance.create(':memory:', {
    allow_unsigned_extensions: 'true',
  });

  // Create connection
  const connection = await duckDB.connect();

  return connection;
}

// Promisify query method
// export const query = (query: string, filteringEnabled = true): Promise<DuckDB.TableData> => {
//   return new Promise((resolve, reject) => {
//     connection.all(filterQuery(query, filteringEnabled), (err, res) => {
//       if (err) reject(err);
//       resolve(res);
//     });
//   });
// };

export const query = async (connection: DuckDBConnection, query: string, filteringEnabled = true): Promise<DuckDBMaterializedResult> => {
  return connection.run(filterQuery(query, filteringEnabled));
}

// export const streamingQuery = (query: string, filteringEnabled = true): Promise<DuckDB.IpcResultStreamIterator> => {
//   return connection.arrowIPCStream(filterQuery(query, filteringEnabled));
// };

export const initialize = async (connection: DuckDBConnection) => {
  // Load home directory
  await query(connection, `SET home_directory='/tmp';`, false);

  // Hint: INSTALL httpfs; is needed again, because it's no longer included in the new repo:
  // https://github.com/duckdb/duckdb-node/tree/v1.1.1/src/duckdb/extension
  await query(connection, 'INSTALL \'/app/extensions/httpfs.duckdb_extension\';', false);
  await query(connection, 'LOAD \'/app/extensions/httpfs.duckdb_extension\';', false);
  await query(connection, 'INSTALL \'/app/extensions/json.duckdb_extension\';', false);
  await query(connection, 'LOAD \'/app/extensions/json.duckdb_extension\';', false);

  if (process.env.R2_TOKEN && process.env.R2_ENDPOINT && process.env.R2_CATALOG) {
    console.log('Initializing R2 catalog...');
    // Load iceberg extension
    await query(connection, 'INSTALL \'/app/extensions/avro.duckdb_extension\';', false);
    await query(connection, 'LOAD \'/app/extensions/avro.duckdb_extension\';', false);
    await query(connection, 'INSTALL \'/app/extensions/aws.duckdb_extension\';', false);
    await query(connection, 'LOAD \'/app/extensions/aws.duckdb_extension\';', false);
    await query(connection, 'INSTALL \'/app/extensions/iceberg.duckdb_extension\';', false);
    await query(connection, 'LOAD \'/app/extensions/iceberg.duckdb_extension\';', false);

    // Create secrets
    await query(connection, `CREATE OR REPLACE SECRET r2_catalog_secret (TYPE ICEBERG, TOKEN '${process.env.R2_TOKEN}', ENDPOINT '${process.env.R2_ENDPOINT}');`, false);
    //await query(`CREATE OR REPLACE SECRET r2_s3_secret (TYPE S3, PROVIDER config, KEY_ID '${process.env.S3_ACCESS_KEY_ID}', SECRET '${process.env.S3_SECRET_ACCESS_KEY}', ENDPOINT '${process.env.S3_ENDPOINT}', URL_STYLE 'path', REGION 'auto');`, false);

    // Attach catalog
    await query(connection, `ATTACH '${process.env.R2_CATALOG}' AS r2_datalake (TYPE ICEBERG, ENDPOINT '${process.env.R2_ENDPOINT}');`, false);
  } 

  // Whether or not the global http metadata is used to cache HTTP metadata, see https://github.com/duckdb/duckdb/pull/5405
  await query(connection, 'SET enable_http_metadata_cache=true;', false);

  // Whether or not object cache is used to cache e.g. Parquet metadata
  await query(connection, 'SET enable_object_cache=true;', false);

  // Whether or not HTTP logging is enabled
  await query(connection, 'SET enable_http_logging=true;', false);

  // Lock the configuration
  await query(connection, `SET lock_configuration=true;`, false);
};
