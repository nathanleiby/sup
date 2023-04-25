import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Group,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { NavLink, useLoaderData } from "react-router-dom";
import { todoLoaderData } from "./todoLoader";
import { TodoTimeline } from "./TodoTimeline";

export default function Todo() {
  const { todo } = useLoaderData() as todoLoaderData;
  if (!todo) {
    return <>no todo found</>;
  }

  const { summary, notes, tags, isComplete, isStarred } = todo;

  const items = [
    { title: "Todos", href: "/todos" },
    { title: summary, href: "#" },
  ].map((item, index) => (
    <NavLink to={item.href} key={index}>
      {item.title}
    </NavLink>
  ));

  return (
    <>
      <Breadcrumbs separator="→">{items}</Breadcrumbs>
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
        <Checkbox label="Is Complete" mt="md" checked={isComplete} disabled />
        <Group>
          <Checkbox label="Is Starred" mt="md" checked={isStarred} disabled />{" "}
          {isStarred ? <IconStarFilled /> : <IconStar />}
        </Group>
      </Box>

      <Box>
        <TodoTimeline todoID={todo.id!} />
      </Box>
    </>
  );
}
