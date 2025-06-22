import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './waitlist.db',
  driver: sqlite3.Database
});

export async function initDB() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function addMember(email) {
  const db = await dbPromise;
  try {
    await db.run('INSERT INTO waitlist_members (email) VALUES (?)', email);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getMembers() {
  const db = await dbPromise;
  return db.all('SELECT * FROM waitlist_members ORDER BY created_at DESC');
} 