import { Box, NumberInput, Text, Textarea, TextInput } from "@mantine/core";
import { NavLink, useLoaderData } from "react-router-dom";
import { supLoaderData } from "./supLoader";

export default function Sup() {
  const { entry } = useLoaderData() as supLoaderData;
  if (!entry) {
    return <>no entry found</>;
  }

  const { summary, notes, todo_id } = entry;

  return (
    <>
      <Text size={36}>View Sup</Text>
      <Box maw={400} mx="auto">
        <TextInput label="Summary" value={summary} disabled />
        <Textarea label="Notes" mt="md" value={notes} disabled />
        <NavLink to={todo_id ? `/todos/${todo_id}` : "#"}>
          <NumberInput label="Todo ID" mt="md" value={todo_id} disabled />
        </NavLink>
      </Box>
    </>
  );
}
