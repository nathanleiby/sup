import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { TodoItem, db } from "../db";

import {
  Badge,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  ScrollArea,
  Switch,
  TextInput,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSearch } from "@tabler/icons-react";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { CheckboxStarIcon } from "./CheckboxStarIcon";
import { TagSelectItem, Value as TagValue, tagToColor } from "./Value";

type RowData = TodoItem;

function filterBySearchInput(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

export function Todos() {
  // TODO: this isn't re-rendering when I update a todo by clicking a checkbox
  const data = useLiveQuery(() =>
    db.todos.orderBy("created_at").reverse().toArray()
  );

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "created_at",
    direction: "desc",
  });
  const [search, setSearch] = useState("");
  const [filterByTags, setFilterByTags] = useState<string[]>([]);
  const [hideCompletedTodos, setHideCompletedTodos] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false);

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

  // Sort data
  const sortedData = _.orderBy(
    data,
    sortStatus.columnAccessor,
    sortStatus.direction
  );

  // Filter data
  const searchFiltered = filterBySearchInput(sortedData, search);

  const sortedAndFilteredData = filterByTags
    ? _.filter(searchFiltered, (x) =>
        _.every(_.map(filterByTags, (t) => x.tags.includes(t)))
      )
    : searchFiltered;

  const sortedAndFilteredData2 = sortedAndFilteredData.filter((todo) =>
    hideCompletedTodos ? !todo.isComplete : true
  );

  return (
    <ScrollArea>
      <div>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={(event) => {
            const { value } = event.currentTarget;
            setSearch(value);
          }}
        />
        <Group>
          <MultiSelect
            placeholder="Filter by tag"
            mb="md"
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
            mb="md"
            label="Hide completed todos"
            checked={hideCompletedTodos}
            onChange={(v) => setHideCompletedTodos(v.currentTarget.checked)}
          />
          <Switch
            mb="md"
            label="Show all details"
            checked={isDetailMode}
            onChange={(v) => setIsDetailMode(v.currentTarget.checked)}
          />
        </Group>
        <NavLink to="/todos/create">
          <Button mb="md">Add Todo (+)</Button>
        </NavLink>
      </div>
      <DataTable
        withBorder
        withColumnBorders
        striped
        records={sortedAndFilteredData2}
        minHeight={sortedAndFilteredData2.length === 0 ? 200 : undefined}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          {
            accessor: "isComplete",
            sortable: true,
            render: (record) => {
              return (
                <Checkbox
                  checked={record.isComplete}
                  onChange={async (e) => {
                    await db.todos.update(record.id!, {
                      isComplete: e.target.checked,
                    });
                  }}
                />
              );
            },
          },
          {
            accessor: "isStarred",
            sortable: true,
            render: (record) => {
              return (
                <Group>
                  <Checkbox
                    icon={CheckboxStarIcon}
                    checked={record.isStarred}
                    onChange={async (e) => {
                      await db.todos.update(record.id!, {
                        isStarred: e.target.checked,
                      });
                    }}
                  />
                </Group>
              );
            },
          },
          {
            accessor: "summary",
            render: (record) => {
              return (
                <NavLink to={`/todos/${record.id}`}>{record.summary}</NavLink>
              );
            },
            sortable: true,
            ellipsis: true,
          },
          {
            accessor: "tags",
            render: (record) => {
              return record.tags.map((t, idx) => {
                return (
                  <Fragment key={idx}>
                    <Badge
                      key={idx}
                      color={tagToColor(t)}
                      onClick={() => {
                        console.log("click");
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
            accessor: "dueDate",
            sortable: true,
            ellipsis: true,
            hidden: !isDetailMode,
            render: (record) => {
              if (!record.dueDate) return;
              return format(record.dueDate, "yyy-MM-dd");
            },
          },
          {
            accessor: "notes",
            sortable: true,
            ellipsis: true,
            hidden: !isDetailMode,
          },
          {
            accessor: "created_at",
            sortable: true,
            render: (record) => {
              return record.created_at.toISOString();
            },
            ellipsis: true,
            hidden: !isDetailMode,
          },
        ]}
      />
    </ScrollArea>
  );
}
