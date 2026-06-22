import Database, { type Database as SQLiteDatabase } from "better-sqlite3";

let database: SQLiteDatabase | null = null;

export function getDatabase() {
  if (!database) {
    const filename = process.env.DATABASE_URL?.replace("file:", "") || "heist-stoker.sqlite";
    database = new Database(filename);
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = ON");
  }

  return database;
}

export function closeDatabase() {
  database?.close();
  database = null;
}
