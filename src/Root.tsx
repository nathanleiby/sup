import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { HeaderTabsColored } from "./HeaderWithTabs";

export default function Root() {
  return (
    <>
      <HeaderTabsColored user={{ name: "Nathan", image: "" }} />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
