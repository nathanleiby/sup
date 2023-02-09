import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

export default function Entry() {
  // TODO: Get ID from path
  const id = 24;

  // TODO: lookup one Entry
  const entry = useLiveQuery(() => db.entries.get({ id }));
  if (!entry) {
    return <>no entry found</>;
  }

  const { summary, notes, todo_id } = entry;

  return (
    <form>
      <FormControl>
        <FormLabel htmlFor="summary">Summary</FormLabel>
        <Input disabled id="summary" placeholder="summary" value={summary} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="notes">Notes</FormLabel>
        <Input disabled id="notes" placeholder="notes" value={notes} />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="todo_id">Todo ID</FormLabel>
        <Input disabled id="todo_id" placeholder="todo_id" value={todo_id} />
      </FormControl>
    </form>
  );
}
