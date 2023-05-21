import _ from "lodash";
import { TodoItem, db } from "../db";
import { useLiveQuery } from "../dexie-react-hooks";

import type { MRT_ColumnDef } from "mantine-react-table";
import { MantineReactTable } from "mantine-react-table";

import {
  Badge,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Stack,
  Switch,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { format, formatDistance } from "date-fns";
import { Fragment, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { CheckboxStarIcon } from "./CheckboxStarIcon";
import { TagSelectItem, TagValue, tagToColor } from "./Value";

export function Todos() {
  const data = useLiveQuery(() =>
    db.todos.orderBy("created_at").reverse().toArray()
  );

  const [filterByTags, setFilterByTags] = useState<string[]>([]);
  const [hideCompletedTodos, setHideCompletedTodos] = useState<boolean>(true);

  const columns = useMemo<MRT_ColumnDef<TodoItem>[]>(
    () => [
      {
        header: "Is Complete",
        accessorKey: "isComplete",
        size: 40,
        maxSize: 100,
        enableSorting: true,
        sortUndefined: 1,
        accessorFn: (record) => {
          return (
            <Checkbox
              checked={record.isComplete}
              onChange={async (e) => {
                const changes = {
                  isComplete: e.target.checked,
                };
                // eslint-disable-next-line
                // @ts-ignore
                await db.todos.update(record.id, changes);
              }}
            />
          );
        },
      },
      {
        header: "Is Starred",
        accessorKey: "isStarred",
        size: 40,
        maxSize: 100,
        enableSorting: true,
        sortingFn: "basic",
        Cell: ({ cell }) => {
          return (
            <Group>
              <Checkbox
                icon={CheckboxStarIcon}
                checked={cell.getValue<boolean>()}
                onChange={async (e) => {
                  const changes = {
                    isStarred: e.target.checked,
                  };
                  // eslint-disable-next-line
                  // @ts-ignore
                  await db.todos.update(record.id, changes);
                }}
              />
            </Group>
          );
        },
      },
      {
        header: "Summary",
        id: "summary",
        accessorFn: (record) => {
          return <NavLink to={`/todos/${record.id}`}>{record.summary}</NavLink>;
        },
        enableSorting: true,
      },
      {
        header: "Tags",
        accessorKey: "tags",
        enableSorting: true,
        sortingFn: "basic",
        sortUndefined: 1,
        // TODO: Explore filtering by tags in arr
        // https://tanstack.com/table/v8/docs/api/features/filters?from=reactTableV7&original=https%3A%2F%2Freact-table-v7.tanstack.com%2Fdocs%2Fapi%2FuseGlobalFilter
        Cell: ({ cell }) => {
          const tags = cell.getValue<string[]>();
          return tags.map((t, idx) => {
            return (
              <Fragment key={idx}>
                <Badge
                  key={idx}
                  color={tagToColor(t)}
                  onClick={() => {
                    if (_.includes(filterByTags, t)) {
                      setFilterByTags(_.without(filterByTags, t));
                    } else {
                      setFilterByTags(_.concat(filterByTags, t));
                    }
                  }}
                >
                  {t}
                </Badge>{" "}
              </Fragment>
            );
          });
        },
      },
      {
        header: "Due Date",
        accessorKey: "dueDate",
        enableSorting: true,
        sortingFn: "datetime",
        sortUndefined: 1,
        Cell: ({ cell }) => {
          const value = cell.getValue<Date | undefined>();
          if (!value) return;
          const distance = formatDistance(value, new Date(), {
            addSuffix: true,
          });
          const actualDate = format(value, "yyyy-MM-dd");
          return `${actualDate} (${distance})`;
        },
      },
      {
        header: "Notes",
        accessorKey: "notes",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        enableSorting: true,
        sortingFn: "datetime",
        sortUndefined: 1,
        Cell: ({ cell }) => {
          const value = cell.getValue<Date | undefined>();
          if (!value) return;
          return formatDistance(value, new Date(), {
            addSuffix: true,
          });
        },
      },
    ],
    [filterByTags]
  );

  if (!data) {
    return null;
  }

  // Setup tags
  const uniqTags = _.chain(data)
    .map((todo) => todo.tags)
    .concat()
    .flatten()
    .uniq()
    .value();

  const filteredData = filterByTags
    ? _.filter(data, (x) =>
        _.every(_.map(filterByTags, (t) => x.tags.includes(t)))
      )
    : data;

  const filteredData2 = filteredData.filter((todo) =>
    hideCompletedTodos ? !todo.isComplete : true
  );

  return (
    <Stack>
      <Group grow>
        <Group position="left">
          <MultiSelect
            placeholder="Filter by tag"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={filterByTags}
            valueComponent={TagValue}
            itemComponent={TagSelectItem}
            onChange={(v) => setFilterByTags(v)}
            data={uniqTags}
            searchable
            clearable
          />
          <Switch
            label="Hide completed todos"
            checked={hideCompletedTodos}
            onChange={(v) => setHideCompletedTodos(v.currentTarget.checked)}
          />
        </Group>
        <Group position="right">
          <NavLink to="/todos/create">
            <Button>Add Todo (+)</Button>
          </NavLink>
        </Group>
      </Group>

      <MantineReactTable
        columns={columns}
        data={filteredData2}
        enableColumnActions={false}
        // enableColumnResizing
        initialState={{ density: "xs" }}
        enableHiding
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enablePagination={false}
      />
    </Stack>
  );
}
