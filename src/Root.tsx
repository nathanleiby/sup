import { AppShell, useMantineTheme } from "@mantine/core";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconDashboard, IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { HeaderWithTabs } from "./HeaderWithTabs";
import { initStoragePersistence } from "./bootstrap";

export default function Root() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  useEffect(() => {
    initStoragePersistence();
  }, []);

  const actions: SpotlightAction[] = [
    {
      title: "Add Todo",
      description: "Add a new todo",
      onTrigger: () => navigate("/todos/create"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "View Todos",
      description: "View all todos",
      onTrigger: () => navigate("/todos"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Add Sup",
      description: "Add a new sup",
      onTrigger: () => navigate("/sups/create"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "View Sups",
      description: "View all sups",
      onTrigger: () => navigate("/sups"),
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
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          header={<HeaderWithTabs />}
        >
          <Outlet />
        </AppShell>
      </SpotlightProvider>
    </>
  );
}
