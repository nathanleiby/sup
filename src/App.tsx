import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Root from "./Root";
import AddSup from "./Sups/AddSup";
import Sup, { supLoader } from "./Sups/Sup";
import Sups from "./Sups/Sups";
import CreateOrEditTodo from "./Todos/CreateOrEditTodo";
import Todo, { todoLoader } from "./Todos/Todo";
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
