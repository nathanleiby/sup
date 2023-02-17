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
import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";
import { db, TodoItem } from "../db";

type LoaderData = {
  todo?: TodoItem;
};

export const todoLoader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.itemId || "");
  if (!id) {
    return {};
  }

  const todo = await db.todoItems.get({ id });
  const out: LoaderData = {
    todo,
  };
  return out;
};

export default function CreateOrEditTodo() {
  const { todo } = useLoaderData() as LoaderData;
  const initialValues = todo
    ? todo
    : {
        summary: "",
        notes: "",
        tags: [],
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

  // TODO: update this query to grab unique tags directly
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
      <Text size={36}>{todo ? "Edit" : "Add"} Todo</Text>
      <Box
        ref={focusRef}
        component="form"
        maw={400}
        mx="auto"
        onSubmit={form.onSubmit((values) => {
          const { summary, notes, tags } = values;
          const asyncWrapper = async () => {
            if (todo) {
              const _ = await db.todoItems.update(todo.id!, {
                summary,
                notes,
                tags,
              });
            } else {
              const _ = await db.todoItems.add({
                summary,
                notes,
                created_at: new Date(),
                tags,
                isComplete: false,
              });
            }
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
