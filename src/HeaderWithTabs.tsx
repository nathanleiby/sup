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
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "./db";
import { useObservable } from "./dexie-react-hooks";
import { FocusSupButton } from "./Sups/FocusSupButton";

const useStyles = createStyles((theme) => ({
  titleLink: {
    textDecoration: "none",
    color: theme.colors.pink[4],
    "&:focus, &:hover, &:visited, &:link, &:active": {
      textDecoration: "none",
    },
  },
}));

export function HeaderWithTabs() {
  const { theme, classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const { tabValue } = useParams();
  const navigate = useNavigate();
  /* eslint-disable-next-line */
  /* @ts-ignore */
  const user = useObservable<UserLogin>(db.cloud.currentUser); // https://dexie.org/cloud/docs/UserLogin

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

        <Link to="/" className={classes.titleLink}>
          <Title>
            <IconRipple /> Sup
          </Title>
        </Link>
        {/* TODO: someday, use icons */}
        {/* eslint-disable-next-line */}
        {/* @ts-ignore */}
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
        <Text>{user.isLoggedIn ? `User = ${user.name}` : undefined}</Text>
      </div>
    </Header>
  );
}
