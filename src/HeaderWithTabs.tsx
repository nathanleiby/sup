import {
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconRipple } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./db";
import { FocusSupButton } from "./Sups/FocusSupButton";

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

export function HeaderWithTabs({ user }: HeaderTabsProps) {
  const { theme } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { tabValue } = useParams();
  const navigate = useNavigate();

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
          <Group position="apart">
            <Tabs
              value={tabValue}
              onTabChange={(value) => navigate(`/${value}`)}
            >
              <Tabs.List>
                <Tabs.Tab value="sups">Sups</Tabs.Tab>
                <Tabs.Tab value="todos">Todos</Tabs.Tab>
                <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <FocusSupButton />
          </Group>
        </Container>
      </div>
    </Header>
  );
}
