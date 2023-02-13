import { Container } from "@mantine/core";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import {
  IconDashboard,
  IconFileText,
  IconHome,
  IconSearch,
} from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { HeaderTabsColored } from "./HeaderWithTabs";

export default function Root() {
  const navigate = useNavigate();

  const actions: SpotlightAction[] = [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => console.log("Home"),
      icon: <IconHome size={18} />,
    },
    {
      title: "Add Todo",
      description: "Add a new todo",
      onTrigger: () => navigate("/todos/create"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Documentation",
      description: "Visit documentation to lean more about all features",
      onTrigger: () => console.log("Documentation"),
      icon: <IconFileText size={18} />,
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
