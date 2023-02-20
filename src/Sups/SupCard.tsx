import { Box, NumberInput, Textarea, TextInput } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { Entry } from "../db";

export interface SupBox {
  entry: Entry;
}

export default function SupBox(props: SupBox) {
  const { todo_id, summary, notes } = props.entry;

  return (
    <Box maw={400} mx="auto">
      <TextInput label="Summary" value={summary} disabled />
      <Textarea label="Notes" mt="md" value={notes} disabled />
      <NavLink to={todo_id ? `/todos/${todo_id}` : "#"}>
        <NumberInput label="Todo ID" mt="md" value={todo_id} disabled />
      </NavLink>
    </Box>
  );
}
