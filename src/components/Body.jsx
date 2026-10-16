import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import useAuthListener from "../hooks/useAuthListener";
import Login from "./Login";
import Browse from "./Browse";

const AppLayout = () => {
  useAuthListener();
  return <Outlet />;
};

const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Browse /> },
      { path: "/login", element: <Login /> },
      // Old links (the browse page used to require signing in).
      { path: "/browse", element: <Navigate to="/" replace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const Body = () => <RouterProvider router={appRouter} />;

export default Body;
