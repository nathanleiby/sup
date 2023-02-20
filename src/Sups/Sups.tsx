import { useLiveQuery } from "dexie-react-hooks";
import { db, Entry } from "../db";

import {
  Button,
  Center,
  createStyles,
  Group,
  ScrollArea,
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
import { formatRelative } from "date-fns";
import { DataTable } from "mantine-datatable";
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

type RowData = Entry;

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
        <NavLink to="/sups/create">
          <Button>Add Sup (+)</Button>
        </NavLink>
      </div>
      <DataTable
        withBorder
        withColumnBorders
        striped
        records={sortedData}
        columns={[
          {
            accessor: "id",
            render: (record) => {
              return <NavLink to={`/sups/${record.id}`}>{record.id}</NavLink>;
            },
          },
          {
            accessor: "timestamp",
            render: (record) => {
              return formatRelative(record.timestamp, new Date());
            },
          },
          { accessor: "summary" },
          { accessor: "notes" },
          {
            accessor: "todo_id",
            render: (record) => {
              return record.todo_id ? (
                <NavLink to={`/todos/${record.todo_id}`}>{record.id}</NavLink>
              ) : null;
            },
          },
        ]}
      />
    </ScrollArea>
  );
}

export default function Sups() {
  const results = useLiveQuery(() =>
    db.entries.orderBy("timestamp").reverse().limit(100).toArray()
  );
  if (!results) {
    // TODO: Loading indicator
    return null;
  }

  return <TableSort data={results} />;
}
