import { Box, Button, Text, Textarea, TextInput } from "@mantine/core";
import { NavLink, useLoaderData } from "react-router-dom";
import { todoLoaderData } from "./todoLoader";
import { TodoTimeline } from "./TodoTimeline";

export default function Todo() {
  const { todo } = useLoaderData() as todoLoaderData;
  if (!todo) {
    return <>no todo found</>;
  }

  const { summary, notes, tags } = todo;

  return (
    <>
      <Text size={36}>View Todo</Text>
      <NavLink
        to={`/sups/create?todo_id=${
          todo.id
        }&summary=Working on "${summary.substring(0, 30)}${
          summary.length > 30 ? "..." : ""
        }"`}
      >
        <Button>Add Sup (+)</Button>
      </NavLink>
      <NavLink to={`/todos/${todo.id}/edit`}>
        <Button>Edit</Button>
      </NavLink>

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
        <TextInput
          label="Tags"
          placeholder="Tags"
          mt="md"
          value={tags}
          disabled
        />
      </Box>

      <Box>
        <TodoTimeline todoID={todo.id!} />
      </Box>
    </>
  );
}
