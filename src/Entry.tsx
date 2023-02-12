import { Box, NumberInput, Text, TextInput } from "@mantine/core";
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
    <>
      <Text size={36}>Add Sup</Text>
      <Box maw={400} mx="auto">
        <TextInput
          label="Summary"
          placeholder="Summary"
          withAsterisk
          value={summary}
        />
        <TextInput label="Notes" placeholder="Notes" mt="md" />
        <NumberInput label="Todo ID" placeholder="Todo ID" mt="md" />
      </Box>
    </>
  );
}
