// db.ts
import Dexie, { Table } from "dexie";

export interface Entry {
  id?: number;
  timestamp: Date;
  summary: string;
  notes: string;
  todo_id?: number;
}

export interface TodoItem {
  id?: number;
  created_at: Date;
  summary: string;
  notes: string;
  tags: string[];
}

export class MySubClassedDexie extends Dexie {
  entries!: Table<Entry>;
  todoItems!: Table<TodoItem>;

  constructor() {
    super("supDatabase");
    this.version(3).stores({
      // Primary key and indexed props
      entries: "++id, timestamp, summary, notes, todo_id",
      todoItems: "++id, created_at, summary, notes, tags",
    });
  }
}

export const db = new MySubClassedDexie();
