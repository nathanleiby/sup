import { LoaderFunction } from "react-router-dom";
import { db, Entry } from "../db";

export type supLoaderData = {
  entry?: Entry;
};

export const supLoader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.itemId || "");
  if (!id) {
    return {};
  }

  const entry = await db.entries.get({ id });
  const out: supLoaderData = {
    entry,
  };
  return out;
};
