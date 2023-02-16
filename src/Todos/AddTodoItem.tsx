import {
  Box,
  Button,
  Group,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, TodoItem } from "../db";

export default function AddTodoItem() {
  const form = useForm({
    initialValues: {
      summary: "",
      notes: "",
      tags: [],
    },

    validate: {
      summary: hasLength(
        { min: 3 },
        "Summary must be at least 3 characters long"
      ),
    },
  });

  const results = useLiveQuery(() =>
    db.todoItems.orderBy("created_at").reverse().limit(100).toArray()
  );

  const [createdSelectOptions, setCreatedSelectOptions] = useState<string[]>(
    []
  );

  const allExistingTags = _.chain(results || [])
    .map((item: TodoItem) => item.tags)
    .flatten()
    .uniq()
    .sort()
    .value();

  const selectOptions = allExistingTags.concat(createdSelectOptions);

  const navigate = useNavigate();
  const focusRef = useFocusTrap();

  return (
    <>
      <Text size={36}>Add Todo</Text>
      <Box
        ref={focusRef}
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
              tags,
              isComplete: false,
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
        <Textarea
          label="Notes"
          placeholder="Notes"
          mt="md"
          {...form.getInputProps("notes")}
        />
        <MultiSelect
          data={selectOptions}
          label="Tags"
          placeholder="Tags"
          mt="md"
          searchable
          clearable
          creatable
          getCreateLabel={(query) => `add new tag: ${query}`}
          onCreate={(query) => {
            setCreatedSelectOptions(createdSelectOptions.concat([query]));
            return query;
          }}
          {...form.getInputProps("tags")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}
