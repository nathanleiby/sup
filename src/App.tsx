import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import { DailyTimeline } from "./DailyTimeline";
import Login from "./Login";
import Root from "./Root";
import Settings from "./Settings";
import CreateOrEditSup from "./Sups/CreateOrEditSup";
import Sup from "./Sups/Sup";
import Sups from "./Sups/SupsTable";
import { supLoader } from "./Sups/supLoader";
import CreateOrEditTodo from "./Todos/CreateOrEditTodo";
import Todo from "./Todos/Todo";
import { Todos } from "./Todos/Todos";
import { todoLoader } from "./Todos/todoLoader";

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      // login
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "timeline",
        element: <DailyTimeline />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      // sups
      {
        path: "sups",
        element: <Sups />,
      },
      {
        path: "sups/create",
        element: <CreateOrEditSup />,
        loader: supLoader,
      },
      {
        path: "sups/:itemId",
        element: <Sup />,
        loader: supLoader,
      },
      {
        path: "sups/:itemId/edit",
        element: <CreateOrEditSup />,
        loader: supLoader,
      },
      // todos
      {
        path: "todos",
        element: <Todos />,
      },
      {
        path: "todos/create",
        element: <CreateOrEditTodo />,
        loader: todoLoader, // not really needed, but for consistency with "edit" endpoint
      },
      {
        path: "todos/:itemId",
        element: <Todo />,
        loader: todoLoader,
      },
      {
        path: "todos/:itemId/edit",
        element: <CreateOrEditTodo />,
        loader: todoLoader,
      },
      {
        index: true,
        element: <Navigate to="/todos" replace />,
      },
    ],
  },
]);

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <RouterProvider router={router} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
