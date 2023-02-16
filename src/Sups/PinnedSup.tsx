import {
  Accordion,
  Affix,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

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
              <Card.Section>
                <Image
                  src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                  height={160}
                  alt="Norway"
                />
              </Card.Section>

              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>Norway Fjord Adventures</Text>
                <Badge color="pink" variant="light">
                  On Sale
                </Badge>
              </Group>

              <Text size="sm" color="dimmed">
                Current SUP = {summary}
              </Text>

              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
              >
                Book classic tour now
              </Button>
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Affix>
  );
}
