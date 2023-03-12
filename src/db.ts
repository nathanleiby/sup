// db.ts
import Dexie, { Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";

export interface Entry {
  id?: string;
  timestamp: Date;
  summary: string;
  notes: string;
  todo_id?: number;
}

export interface TodoItem {
  id?: string;
  created_at: Date;
  summary: string;
  notes: string;
  tags: string[];
  isComplete: boolean;
}

export class MySubClassedDexie extends Dexie {
  sups!: Table<Entry>;
  todos!: Table<TodoItem>;

  constructor() {
    console.log("construct!");
    super("supDatabase", { addons: [dexieCloud] });

    this.version(5).stores({
      sups: "@id, timestamp, summary, notes, todo_id",
      todos: "@id, created_at, summary, notes, tags, isComplete",
    });

    this.cloud.configure({
      databaseUrl: "https://z08fbafgx.dexie.cloud",
      requireAuth: true,
    });
  }
}

export const db = new MySubClassedDexie();
