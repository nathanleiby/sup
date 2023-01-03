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
import { useLiveQuery } from "dexie-react-hooks";
import _ from "lodash";
import { db } from "./db";

export default function History() {
  const results = useLiveQuery(() => db.entries.toArray());

  // consider using react-table for built-in sorting support
  // https://chakra-ui.com/getting-started/with-react-table
  return (
    <>
      <Spacer height={4} />
      <TableContainer>
        <Table colorScheme="teal">
          <Thead>
            <Tr>
              <Th isNumeric>ID</Th>
              <Th>Date</Th>
              <Th>Summary</Th>
              <Th>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {_.map(results, ({ id, timestamp, summary, notes }) => {
              return (
                <Tr key={id}>
                  <Td isNumeric>{id}</Td>
                  <Td>{timestamp.toString()}</Td>
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
