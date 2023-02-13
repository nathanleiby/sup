import {
  Box,
  Button,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { db } from "../db";

export default function AddSup() {
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
  const focusRef = useFocusTrap();

  const results = useLiveQuery(() =>
    db.todoItems.orderBy("created_at").reverse().limit(100).toArray()
  );

  const selectOptions = (results || []).map((item) => {
    return {
      value: item.id!.toString(),
      label: item.summary,
    };
  });

  return (
    <>
      <Text size={36}>Add Sup</Text>
      <Box
        ref={focusRef}
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
        <Textarea
          label="Notes"
          placeholder="Notes"
          mt="md"
          {...form.getInputProps("notes")}
        />
        <Select
          data={selectOptions}
          label="Related Todo"
          placeholder="Related Todo"
          mt="md"
          searchable
          clearable
          {...form.getInputProps("todo_id")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}
