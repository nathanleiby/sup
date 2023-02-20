import { LoaderFunction } from "react-router-dom";
import { db, TodoItem } from "../db";

export type todoLoaderData = {
  todo?: TodoItem;
};

export const todoLoader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.itemId || "");
  if (!id) {
    return {};
  }

  const todo = await db.todoItems.get({ id });
  const out: todoLoaderData = {
    todo,
  };
  return out;
};
