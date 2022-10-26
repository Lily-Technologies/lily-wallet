import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { AddressTag } from '@lily/types';

export async function createAddressTable(db: Database<sqlite3.Database, sqlite3.Statement>) {
  const query = `CREATE TABLE IF NOT EXISTS address_labels (id INTEGER PRIMARY KEY, address TEXT NOT NULL, label TEXT NOT NULL)`;
  db.exec(query);
}

export async function addAddressTag(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  address: string,
  label: string
): Promise<number> {
  try {
    const query = `INSERT INTO address_labels (id, address, label) VALUES (null, ?, ?)`;
    const entry = await db.run(query, [address, label]);
    return entry.lastID!;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAddressTag(
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
): Promise<AddressTag[]> {
  try {
    const query = `SELECT * FROM address_labels WHERE address = ?`;
    const labels = await db.all(query, [address]);
    return labels;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
