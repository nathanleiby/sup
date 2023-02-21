import { useLiveQuery } from "dexie-react-hooks";
import { db, Entry } from "../db";

import { Button, ScrollArea } from "@mantine/core";
import { formatRelative } from "date-fns";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface SupTableProps {
  data: Entry[];
}

export function SupTable({ data }: SupTableProps) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "timestamp",
    direction: "desc",
  });
  const [records, setRecords] = useState(sortBy(data, "timestamp"));

  useEffect(() => {
    const sortedData = sortBy(data, sortStatus.columnAccessor);
    setRecords(
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData
    );
  }, [sortStatus, data]);

  return (
    <ScrollArea>
      <div>
        <NavLink to="/sups/create">
          <Button mb="md">Add Sup (+)</Button>
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
