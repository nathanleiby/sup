import {
  Box,
  Button,
  Group,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { db } from "./db";

export default function AddEntry() {
  const form = useForm({
    initialValues: {
      summary: "",
      notes: "",
      todo_id: undefined,
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
      <Text size={36}>Add Sup</Text>
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={form.onSubmit((values) => {
          const { summary, notes, todo_id } = values;
          const asyncWrapper = async () => {
            const id = await db.entries.add({
              summary,
              notes,
              timestamp: new Date(),
              todo_id,
            });
            navigate("/sups");
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
        <NumberInput
          label="Todo ID"
          placeholder="Todo ID"
          mt="md"
          {...form.getInputProps("todo_id")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}
