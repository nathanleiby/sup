import { formatRelative } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { colors } from "../colors";
import { db, TodoItem } from "../db";

import {
  Badge,
  Button,
  Center,
  Checkbox,
  createStyles,
  Group,
  ScrollArea,
  Select,
  Switch,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";

const hashStrToNum = (s: string) => {
  var hash = 0,
    i = 0,
    len = s.length;
  while (i < len) {
    hash = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
  }
  const positive = hash + 2147483647 + 1;
  return positive;
};

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

type RowData = TodoItem;

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  // // TODO: what's up with TS here?
  return filterData(
    [...data].sort((a, b) => {
      if (!a || !a[sortBy]) return 0;
      if (!b || !b[sortBy]) return 0;
      const aStr = (a[sortBy] || "").toString();
      const bStr = (b[sortBy] || "").toString();

      if (payload.reversed) {
        return bStr.localeCompare(aStr);
      }

      return aStr.localeCompare(bStr);
    }),
    payload.search
  );
}

export function TableSort({ data }: TableSortProps) {
  const uniqTags = _.chain(data)
    .map((todo) => todo.tags)
    .concat()
    .flatten()
    .uniq()
    .value();

  const tagToColor: { [tag: string]: string } = {};

  uniqTags.forEach((tag) => {
    const h = hashStrToNum(tag) + 1;
    const c = colors[h % colors.length]!;
    const variant = [5, 6, 7, 8, 9][h % 5];
    tagToColor[tag] = `${c}.${variant}`;
  });

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [filterByTag, setFilterByTag] = useState("");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [hideCompletedTodos, setHideCompletedTodos] = useState(true);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const sortedAndFilteredData = filterByTag
    ? _.filter(sortedData, (x) => x.tags.includes(filterByTag))
    : sortedData;

  const sortedAndFilteredData2 = sortedAndFilteredData.filter((todo) =>
    hideCompletedTodos ? !todo.isComplete : true
  );

  const rows = sortedAndFilteredData2.map((row) => (
    <tr key={row.id}>
      <td>
        <NavLink to={`/todos/${row.id}`}>{row.id}</NavLink>
      </td>
      <td>
        <Checkbox
          checked={row.isComplete}
          onChange={async (e) => {
            await db.todoItems.update(row.id!, {
              isComplete: e.target.checked,
            });
          }}
        />
      </td>
      <td>{formatRelative(row.created_at, new Date())}</td>
      <td>{row.summary}</td>
      <td>{row.notes}</td>
      <td>
        {row.tags.map((t, idx) => {
          return (
            <Fragment key={idx}>
              <Badge key={idx} color={tagToColor[t]}>
                {t}
              </Badge>{" "}
            </Fragment>
          );
        })}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <div>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Group>
          <Select
            placeholder="Filter by tag"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={filterByTag}
            onChange={(v) => setFilterByTag(v || "")}
            data={uniqTags}
            searchable
          />
          <Switch
            mb="md"
            label="Hide completed todos"
            checked={hideCompletedTodos}
            onChange={(v) => setHideCompletedTodos(v.currentTarget.checked)}
          />
        </Group>
        <NavLink to="/todos/create">
          <Button>Add Todo (+)</Button>
        </NavLink>
      </div>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
        withBorder
        withColumnBorders
        highlightOnHover
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "id"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("id")}
            >
              ID
            </Th>
            <Th
              sorted={sortBy === "isComplete"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("isComplete")}
            >
              Complete?
            </Th>
            <Th
              sorted={sortBy === "created_at"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("created_at")}
            >
              Created at
            </Th>
            <Th
              sorted={sortBy === "summary"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("summary")}
            >
              Summary
            </Th>
            <Th
              sorted={sortBy === "notes"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("notes")}
            >
              Notes
            </Th>
            <Th
              sorted={sortBy === "tags"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("tags")}
            >
              Tags
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={5}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

export default function History() {
  // TODO: this isn't re-rendering when I update a todo by clicking a checkbox
  const results = useLiveQuery(() =>
    db.todoItems.orderBy("created_at").reverse().toArray()
  );
  if (!results) {
    return null;
  }

  return <TableSort data={results} />;
}
