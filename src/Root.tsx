import { Container } from "@mantine/core";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconDashboard, IconSearch } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { HeaderTabsColored } from "./HeaderWithTabs";

export default function Root() {
  const navigate = useNavigate();

  const actions: SpotlightAction[] = [
    {
      title: "Add Todo",
      description: "Add a new todo",
      onTrigger: () => navigate("/todos/create"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Add Sup",
      description: "Add a new sup",
      onTrigger: () => navigate("/sups/create"),
      icon: <IconDashboard size={18} />,
    },
  ];

  return (
    <>
      <SpotlightProvider
        actions={actions}
        searchIcon={<IconSearch size={18} />}
        searchPlaceholder="Search..."
        shortcut={["mod + P", "mod + K", "/"]}
        nothingFoundMessage="Nothing found..."
      >
        <HeaderTabsColored user={{ name: "Nathan", image: "" }} />
        <Container>
          <Outlet />
        </Container>
      </SpotlightProvider>
      ;
    </>
  );
}
