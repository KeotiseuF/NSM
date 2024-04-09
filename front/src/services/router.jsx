import {  createBrowserRouter } from "react-router-dom";
import Error from '../pages/Error/Error'
import App from '../App';
import Home from "../pages/Home/Home";
import Operation from "../pages/Operation/Operation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "operation",
        element: <Operation />,
      },
    ],
    errorElement: <Error />
  },
]);

export default router;
