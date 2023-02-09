import {
  Spacer,
  Table,
  TableContainer,
  Tag,
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
    db.todoItems.orderBy("created_at").reverse().limit(10).toArray()
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
              <Th width={2}>Created at</Th>
              <Th width={2}>Summary</Th>
              <Th width={10}>Notes</Th>
              <Th width={10}>Tags</Th>
            </Tr>
          </Thead>
          <Tbody>
            {_.map(results, ({ id, created_at, summary, notes, tags }) => {
              return (
                <Tr key={id}>
                  <Td isNumeric>{id}</Td>
                  <Td>{formatRelative(created_at, new Date())}</Td>
                  <Td>{summary}</Td>
                  <Td>{notes}</Td>
                  <Td>
                    {tags.map((t) => {
                      return (
                        <>
                          <Tag>{t}</Tag>{" "}
                        </>
                      );
                    })}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
