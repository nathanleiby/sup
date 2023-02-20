import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DailyTimeline } from "./DailyTimeline";
import Login from "./Login";
import Root from "./Root";
import CreateOrEditSup from "./Sups/CreateOrEditSup";
import Sup from "./Sups/Sup";
import { supLoader } from "./Sups/supLoader";
import Sups from "./Sups/Sups";
import CreateOrEditTodo from "./Todos/CreateOrEditTodo";
import Todo from "./Todos/Todo";
import { todoLoader } from "./Todos/todoLoader";
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
      {
        path: "timeline",
        element: <DailyTimeline />,
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
