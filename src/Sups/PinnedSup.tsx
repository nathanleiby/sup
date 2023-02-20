import { Accordion, Affix, Card } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import SupBox from "./SupCard";

export default function Sup() {
  const entry = useLiveQuery(() => db.entries.toCollection().last());
  if (!entry) {
    return <></>;
  }

  const { summary, notes, todo_id } = entry;

  return (
    <Affix position={{ top: 0, right: 0 }}>
      <Accordion
        chevron={<IconPlus size={16} />}
        styles={{
          chevron: {
            "&[data-rotate]": {
              transform: "rotate(45deg)",
            },
          },
        }}
      >
        <Accordion.Item value="focus-ring">
          <Accordion.Control>Current SUP = {summary}</Accordion.Control>
          <Accordion.Panel>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <SupBox entry={entry} />
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Affix>
  );
}
