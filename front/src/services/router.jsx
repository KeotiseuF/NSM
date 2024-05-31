import {  createBrowserRouter } from "react-router-dom";

import App from '../App';
import Error from '../pages/Error/Error';
import Home from "../pages/Home/Home";
import Operation from "../pages/Operation/Operation";

const router = createBrowserRouter([
  {
    path: "/NSM",
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
    errorElement: <Error />,
  },
]);

export default router;
