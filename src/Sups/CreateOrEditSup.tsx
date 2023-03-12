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
import { useLoaderData, useNavigate } from "react-router-dom";
import { db } from "../db";
import { supLoaderData } from "./supLoader";

export default function CreateOrEditSup() {
  const searchParams = new URLSearchParams(document.location.search);
  const todo_id = searchParams.get("todo_id") || "";
  const summary = searchParams.get("summary") || "";
  const notes = searchParams.get("notes") || "";

  const { entry } = useLoaderData() as supLoaderData;
  const initialValues = entry
    ? entry
    : {
        todo_id,
        summary,
        notes,
      };

  const form = useForm({
    initialValues,
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
    db.todos.orderBy("created_at").reverse().limit(100).toArray()
  );

  const selectOptions = (results || []).map((item) => {
    return {
      value: item.id!,
      label: item.summary,
    };
  });

  return (
    <>
      <Text size={36}>{entry ? "Edit" : "Add"} Sup</Text>
      <Box
        ref={focusRef}
        component="form"
        maw={400}
        mx="auto"
        onSubmit={form.onSubmit((values) => {
          const { summary, notes, todo_id } = values;
          const asyncWrapper = async () => {
            if (entry) {
              const id = await db.sups.update(entry.id!, {
                summary,
                notes,
                todo_id,
              });
              navigate(`/sups/${entry.id}`);
            } else {
              const id = await db.sups.add({
                summary,
                notes,
                timestamp: new Date(),
                todo_id,
              });
              navigate(`/sups/${id}`);
            }
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
