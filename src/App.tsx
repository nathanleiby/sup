import { MantineProvider } from "@mantine/core";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddEntry from "./AddEntry";
import AddTodoItem from "./AddTodoItem";
import Entry from "./Entry";
import History from "./History";
import Login from "./Login";
import Root from "./Root";
import Todos from "./Todos";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sups/create",
        element: <AddEntry />,
      },
      {
        path: "todos/create",
        element: <AddTodoItem />,
      },
      {
        path: "sups",
        element: <History />,
        // TODO: get this routing working
        children: [
          {
            path: "*",
            element: <Entry />,
          },
        ],
      },
      {
        path: "todos",
        element: <Todos />,
      },
    ],
  },
]);

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
