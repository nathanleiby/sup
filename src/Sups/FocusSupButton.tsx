import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import { db } from "../db";
import { useLiveQuery } from "../dexie-react-hooks";
import SupBox from "./SupCard";

export function FocusSupButton() {
  const [isFocused, setIsFocused] = useState(false);
  const entry = useLiveQuery(() => db.sups.toCollection().last());
  if (!entry) {
    return <></>;
  }

  return (
    <>
      <Modal
        opened={isFocused}
        onClose={() => setIsFocused(false)}
        title="Focus Mode"
        fullScreen
      >
        <SupBox entry={entry} />
      </Modal>

      <Button onClick={() => setIsFocused(!isFocused)}>Focus</Button>
    </>
  );
}
