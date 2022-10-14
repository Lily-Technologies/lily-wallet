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

export async function createAddressTable(db: Database<sqlite3.Database, sqlite3.Statement>) {
  const query = `CREATE TABLE IF NOT EXISTS address_labels (id INTEGER PRIMARY KEY, address TEXT NOT NULL, label TEX NOT NULL)`;
  db.exec(query);
}

export async function addAddressLabel(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  address: string,
  label: string
) {
  try {
    const query = `INSERT INTO address_labels (id, address, label) VALUES (null, ?, ?)`;
    const entry = await db.run(query, [address, label]);
    return entry.lastID;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAddressLabel(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  id: number
) {
  try {
    const query = `DELETE FROM address_labels WHERE id = ?`;
    await db.run(query, [id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllLabelsForAddress(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  address: string
) {
  try {
    const query = `SELECT * FROM address_labels WHERE address = ?`;
    const labels = await db.all(query, [address]);
    return labels;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
