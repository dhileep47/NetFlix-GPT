import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./Login";
import Browse from "./Browse";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
]);

const Body = () => <RouterProvider router={appRouter} />;

export default Body;
