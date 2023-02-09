import {
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { Link } from "react-router-dom";
import { db } from "./db";

export default function History() {
  const results = useLiveQuery(() =>
    db.entries.orderBy("timestamp").reverse().limit(10).toArray()
  );

  // consider using react-table for built-in sorting support
  // https://chakra-ui.com/getting-started/with-react-table
  return (
    <>
      <Spacer height={4} />
      <TableContainer>
        <Table colorScheme="teal">
          <Thead>
            <Tr>
              <Th width={1} isNumeric>
                ID
              </Th>
              <Th width={2}>When</Th>
              <Th width={2}>Summary</Th>
              <Th width={2}>Related TODO</Th>
              <Th width={2}>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {_.map(results, ({ id, timestamp, summary, notes, todo_id }) => {
              return (
                <Tr key={id}>
                  <Td width={1} isNumeric>
                    {id}
                  </Td>
                  <Td width={2}>{formatRelative(timestamp, new Date())}</Td>
                  <Td width={2}>{summary}</Td>
                  <Td width={2}>
                    <Link to={`/todos/${todo_id}`}>{todo_id}</Link>
                  </Td>
                  <Td width={2}>{notes}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
