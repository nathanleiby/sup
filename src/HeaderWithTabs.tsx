import {
  Burger,
  Container,
  createStyles,
  Header,
  MediaQuery,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconRipple } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import { db } from "./db";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    borderBottom: `1px solid ${
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background
    }`,
    marginBottom: 40,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.white,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background!,
      0.1
    ),
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    color: theme.white,
    backgroundColor: "transparent",
    borderColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
    },

    "&[data-active]": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background!,
        0.1
      ),
      borderColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
    },
  },
}));

interface HeaderTabsProps {
  user: { name: string; image: string };
}

export function HeaderTabsColored({ user }: HeaderTabsProps) {
  const { theme } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => toggle()}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Title>
          <IconRipple /> Sup
        </Title>
        {/* TODO: someday, use icons */}
        <Text ml="lg">{db.cloud.syncState.value.phase}</Text>
        <Container>
          <Tabs>
            <Tabs.List>
              <NavLink to="/sups">
                <Tabs.Tab value="sups">Sups</Tabs.Tab>
              </NavLink>
              <NavLink to="/todos">
                <Tabs.Tab value="todos">Todos</Tabs.Tab>
              </NavLink>
              <NavLink to="/timeline">
                <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              </NavLink>
              <NavLink to="/settings">
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
              </NavLink>
            </Tabs.List>
          </Tabs>
        </Container>
      </div>
    </Header>
  );
}