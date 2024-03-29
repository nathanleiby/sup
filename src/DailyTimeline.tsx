import { Text, Timeline } from "@mantine/core";
import { IconGitBranch } from "@tabler/icons-react";
import { format, formatRelative } from "date-fns";
import _ from "lodash";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Entry, db } from "./db";
import { useLiveQuery } from "./dexie-react-hooks";

export const DailyTimeline = () => {
  const allSups = useLiveQuery(() => {
    return db.sups.reverse().sortBy("timestamp");
  });
  if (!allSups) {
    return null;
  }

  const supsByDate = _.groupBy(allSups, (s) =>
    format(s.timestamp, "dd-MM-yyyy")
  );

  return (
    <>
      {_.map(supsByDate, (sups, supsDate) => {
        return (
          <Fragment key={supsDate}>
            <Text mb="md" size={24}>
              {supsDate}
            </Text>
            <SingleTimeline sups={sups} />
            <Text mb="md" />
          </Fragment>
        );
      })}
    </>
  );
};

const SingleTimeline = (props: { sups: Entry[] }) => {
  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      {props.sups.map((sup, supIdx) => {
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
