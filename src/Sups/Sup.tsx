import { Box, NumberInput, Text, Textarea, TextInput } from "@mantine/core";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { db, Entry } from "../db";

type LoaderData = {
  entry?: Entry;
};

export const supLoader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.itemId || "");
  if (!id) {
    return {};
  }

  const entry = await db.entries.get({ id });
  const out: LoaderData = {
    entry,
  };
  return out;
};

export default function Sup() {
  const { entry } = useLoaderData() as LoaderData;
  if (!entry) {
    return <>no entry found</>;
  }

  const { summary, notes, todo_id } = entry;

  return (
    <>
      <Text size={36}>View Sup</Text>
      <Box maw={400} mx="auto">
        <TextInput
          label="Summary"
          placeholder="Summary"
          withAsterisk
          value={summary}
          disabled
        />
        <Textarea
          label="Notes"
          placeholder="Notes"
          mt="md"
          value={notes}
          disabled
        />
        <NumberInput
          label="Todo ID"
          placeholder="Todo ID"
          mt="md"
          value={todo_id}
          disabled
        />
      </Box>
    </>
  );
}
