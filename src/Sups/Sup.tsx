import { Text } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import SupBox from "./SupCard";
import { supLoaderData } from "./supLoader";

export default function Sup() {
  const { entry } = useLoaderData() as supLoaderData;
  if (!entry) {
    return <>no entry found</>;
  }

  const { summary, notes, todo_id } = entry;

  return (
    <>
      <Text size={36}>View Sup</Text>
      <SupBox entry={entry} />
    </>
  );
}
