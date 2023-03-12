import { Text, Timeline } from "@mantine/core";
import { IconGitBranch } from "@tabler/icons-react";
import { formatRelative } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { NavLink } from "react-router-dom";
import { db } from "../db";

export interface TodoTimelineProps {
  todoID: string;
}
export const TodoTimeline = (props: TodoTimelineProps) => {
  const { todoID } = props;
  const sups = useLiveQuery(() => {
    return db.sups
      .where("todo_id")
      .equals(todoID)
      .reverse()
      .sortBy("timestamp");
  });
  if (!sups) {
    return null;
  }

  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      {sups.map((sup, supIdx) => {
        return (
          <Timeline.Item
            bullet={<IconGitBranch size={12} />}
            title={sup.summary}
            key={supIdx}
          >
            <Text color="dimmed" size="sm">
              {sup.notes}{" "}
              <Text variant="link" component="span" inherit>
                <NavLink to={`/sups/${sup.id}`}>{sup.id}</NavLink>
              </Text>{" "}
            </Text>
            <Text size="xs" mt={4}>
              {formatRelative(sup.timestamp, new Date())}
            </Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};
