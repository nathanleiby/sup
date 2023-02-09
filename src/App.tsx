import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddEntry from "./AddEntry";
import AddTodoItem from "./AddTodoItem";
import History from "./History";
import Login from "./Login";
import Root from "./Root";
import Todos from "./Todos";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {};
//  {
//   brand: {
//     900: "#1a365d",
//     800: "#153e75",
//     700: "#2a69ac",
//   },
// };

const theme = extendTheme({ colors });

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "add",
        element: <AddEntry />,
      },
      {
        path: "add_todo",
        element: <AddTodoItem />,
      },
      {
        path: "history",
        element: <History />,
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
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
