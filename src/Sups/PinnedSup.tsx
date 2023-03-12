import { Accordion, Affix, Button, Card, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../db";
import SupBox from "./SupCard";

export default function Sup() {
  const [isFocused, setIsFocused] = useState(false);
  const entry = useLiveQuery(() => db.sups.toCollection().last());
  if (!entry) {
    return <></>;
  }

  const { summary } = entry;

  return (
    <Affix position={{ top: 0, right: 0 }}>
      <Modal
        opened={isFocused}
        onClose={() => setIsFocused(false)}
        title="Focus Mode"
        fullScreen
      >
        <SupBox entry={entry} />
      </Modal>

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
              <Button mt="md" onClick={() => setIsFocused(!isFocused)}>
                Focus
              </Button>
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Affix>
  );
}
