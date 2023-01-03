// db.ts
import Dexie, { Table } from "dexie";

export interface Entry {
  id?: number;
  timestamp: Date;
  summary: string;
  notes: string;
}

export class MySubClassedDexie extends Dexie {
  entries!: Table<Entry>;

  constructor() {
    super("supDatabase");
    this.version(1).stores({
      // TODO: We may not need all of thes as indexed props
      entries: "++id, timestamp, summary, notes", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
