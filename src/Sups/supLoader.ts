import { LoaderFunction } from "react-router-dom";
import { db, Entry } from "../db";

export type supLoaderData = {
  entry?: Entry;
};

export const supLoader: LoaderFunction = async ({ params }) => {
  const id = params.itemId;
  if (!id) {
    return {};
  }

  const entry = await db.sups.get({ id });
  const out: supLoaderData = {
    entry,
  };
  return out;
};
