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
              <Th width={10}>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {_.map(results, ({ id, timestamp, summary, notes }) => {
              return (
                <Tr key={id}>
                  <Td isNumeric>{id}</Td>
                  <Td>{formatRelative(timestamp, new Date())}</Td>
                  <Td>{summary}</Td>
                  <Td>{notes}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
