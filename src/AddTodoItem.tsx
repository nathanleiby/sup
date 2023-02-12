import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { db } from "./db";

export default function AddTodoItem() {
  const form = useForm({
    initialValues: {
      summary: "",
      notes: "",
      tags: "",
    },

    validate: {
      summary: hasLength(
        { min: 3 },
        "Summary must be at least 3 characters long"
      ),
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <Text size={36}>Add Todo</Text>
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={form.onSubmit((values) => {
          const { summary, notes, tags } = values;
          const asyncWrapper = async () => {
            const id = await db.todoItems.add({
              summary,
              notes,
              created_at: new Date(),
              tags: tags.split(","),
            });
            navigate("/todos");
          };
          asyncWrapper().catch(console.error);
        })}
      >
        <TextInput
          label="Summary"
          placeholder="Summary"
          withAsterisk
          {...form.getInputProps("summary")}
        />
        <TextInput
          label="Notes"
          placeholder="Notes"
          mt="md"
          {...form.getInputProps("notes")}
        />
        <TextInput
          label="Tags"
          placeholder="Tags"
          mt="md"
          {...form.getInputProps("tags")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}
