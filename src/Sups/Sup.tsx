import { Breadcrumbs, Button, Text } from "@mantine/core";
import { NavLink, useLoaderData } from "react-router-dom";
import SupBox from "./SupCard";
import { supLoaderData } from "./supLoader";

export default function Sup() {
  const { entry } = useLoaderData() as supLoaderData;
  if (!entry) {
    return <>no entry found</>;
  }

  const items = [
    { title: "Sups", href: "/sups" },
    { title: entry.summary, href: "#" },
  ].map((item, index) => (
    <NavLink to={item.href} key={index}>
      {item.title}
    </NavLink>
  ));

  return (
    <>
      <Breadcrumbs separator="→">{items}</Breadcrumbs>
      <Text size={36}>View Sup</Text>
      <NavLink to={`/sups/${entry.id}/edit`}>
        <Button>Edit</Button>
      </NavLink>
      <SupBox entry={entry} />
    </>
  );
}
