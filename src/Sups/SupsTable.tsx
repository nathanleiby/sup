import { useLiveQuery } from "dexie-react-hooks";
import { db, Entry } from "../db";

import { Button, ScrollArea, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { formatRelative } from "date-fns";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface SupTableProps {
  data: Entry[];
}

export function SupTable({ data }: SupTableProps) {
  const [search, setSearch] = useState("");

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "desc",
  });
  const [records, setRecords] = useState(sortBy(data, "timestamp"));

  useEffect(() => {
    const sortedData = sortBy(data, sortStatus.columnAccessor);

    setRecords(
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData
    );
  }, [sortStatus]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    // TODO: add logic to filter data
    // https://icflorescu.github.io/mantine-datatable/examples/searching-and-filtering
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
        records={records}
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
            sortable: true,
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
            sortable: true,
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </ScrollArea>
  );
}

export default function Sups() {
  const results = useLiveQuery(() =>
    db.entries.orderBy("timestamp").reverse().limit(100).toArray()
  );
  if (!results) {
    return null;
  }

  return <SupTable data={results || []} />;
}
