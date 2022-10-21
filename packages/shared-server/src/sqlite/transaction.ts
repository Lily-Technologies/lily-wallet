import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { TransactionDescription } from '@lily/types';

export async function createTransactionTable(db: Database<sqlite3.Database, sqlite3.Statement>) {
  const query = `CREATE TABLE IF NOT EXISTS transaction_descriptions (txid TEXT UNIQUE PRIMARY KEY, description TEXT NOT NULL)`;
  db.exec(query);
}

export async function addTransactionDescription(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  txid: string,
  description: string
) {
  try {
    const query = `REPLACE INTO transaction_descriptions (txid, description) VALUES (?, ?)`;
    const entry = await db.run(query, [txid, description]);
    return entry.lastID;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTransactionDescription(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  txid: string,
  description: string
) {
  try {
    const query = `UPDATE transaction_descriptions SET description = ? WHERE txid = ?`;
    await db.run(query, [description, txid]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTransactionDescription(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  txid: string
) {
  try {
    const query = `DELETE FROM transaction_descriptions WHERE txid = ?`;
    await db.run(query, [txid]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTransactionDescription(
  db: Database<sqlite3.Database, sqlite3.Statement>,
  txid: string
): Promise<TransactionDescription> {
  try {
    const query = `SELECT * FROM transaction_descriptions WHERE txid = ?`;
    const labels = await db.get(query, [txid]);
    return labels;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
