import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

function createDbConnection(filename: string) {
  return open({
    filename,
    driver: sqlite3.Database
  });
}

export async function dbConnect(userDataPath: string) {
  sqlite3.verbose();
  const db = await createDbConnection(`${userDataPath}/lily.db`);
  return db;
}

export * from './address';
export * from './transaction';
