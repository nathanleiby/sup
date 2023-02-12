import { MantineProvider } from "@mantine/core";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Root from "./Root";
import AddSup from "./Sups/AddSup";
import Sup, { loader } from "./Sups/Sup";
import Sups from "./Sups/Sups";
import AddTodoItem from "./Todos/AddTodoItem";
import Todos from "./Todos/Todos";

const router = createBrowserRouter([
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
      // sups
      {
        path: "sups/create",
        element: <AddSup />,
      },

      {
        path: "sups",
        element: <Sups />,
      },
      {
        path: "sups/:itemId",
        element: <Sup />,
        loader: loader,
      },
      // todos
      {
        path: "todos",
        element: <Todos />,
      },
      {
        path: "todos/create",
        element: <AddTodoItem />,
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
