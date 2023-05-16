import {
  Box,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import _ from "lodash";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { db, TodoItem } from "../db";
import { useLiveQuery } from "../dexie-react-hooks";
import { CheckboxStarIcon } from "./CheckboxStarIcon";
import { todoLoaderData } from "./todoLoader";
import { TagSelectItem, TagValue } from "./Value";

export default function CreateOrEditTodo() {
  const { todo } = useLoaderData() as todoLoaderData;
  const initialValues = todo
    ? todo
    : {
        summary: "",
        notes: "",
        tags: [],
        isComplete: false,
        isStarred: false,
        dueDate: undefined,
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
    db.todos.orderBy("created_at").reverse().limit(100).toArray()
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
          const { summary, notes, tags, isComplete, isStarred, dueDate } =
            values;
          const asyncWrapper = async () => {
            if (todo) {
              const changes = {
                summary,
                notes,
                tags,
                isComplete,
                isStarred,
                dueDate,
              };
              // eslint-disable-next-line
              // @ts-ignore
              await db.todos.update(todo.id, changes);
              navigate(`/todos/${todo.id}`);
            } else {
              const id = await db.todos.add({
                summary,
                notes,
                created_at: new Date(),
                tags,
                isComplete: false,
                isStarred,
                dueDate,
              });
              navigate(`/todos/${id}`);
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
        <MultiSelect
          data={selectOptions}
          label="Tags"
          placeholder="Tags"
          mt="md"
          valueComponent={TagValue}
          itemComponent={TagSelectItem}
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
        <DatePickerInput
          label="Due Date"
          mt="md"
          {...form.getInputProps("dueDate")}
        />
        <Group>
          <Checkbox
            label="Is Starred"
            mt="md"
            icon={CheckboxStarIcon}
            {...form.getInputProps("isStarred")}
          />
        </Group>
        {todo && (
          <Checkbox
            label="Is Complete"
            mt="md"
            {...form.getInputProps("isComplete")}
          />
        )}
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </>
  );
}
