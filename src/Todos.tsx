import { formatRelative } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { colors } from "./colors";
import { db, TodoItem } from "./db";

import {
  Badge,
  Button,
  Center,
  createStyles,
  Group,
  ScrollArea,
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
import { useState } from "react";
import { NavLink } from "react-router-dom";

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
  const allTags = _.chain(data)
    .map((todo) => todo.tags)
    .concat()
    .flatten()
    .value();

  const tagToColor: { [tag: string]: string } = {};
  allTags.forEach((tag) => {
    if (!tagToColor[tag]) {
      tagToColor[tag] = `${_.sample(colors)!}.${_.sample([5, 6, 7, 8, 9])}`;
    }
  });

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{formatRelative(row.created_at, new Date())}</td>
      <td>{row.summary}</td>
      <td>{row.notes}</td>
      <td>
        {row.tags.map((t, idx) => {
          return (
            <>
              <Badge key={idx} color={tagToColor[t]}>
                {t}
              </Badge>{" "}
            </>
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
        <NavLink to="/todos/create">
          <Button>Add Todo (+)</Button>
        </NavLink>
      </div>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "id"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("id")}
            >
              Name
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
  const results = useLiveQuery(() =>
    db.todoItems.orderBy("created_at").reverse().limit(10).toArray()
  );
  if (!results) {
    // TODO: Loading indicator
    return null;
  }

  return <TableSort data={results} />;
}
