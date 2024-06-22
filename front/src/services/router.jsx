import {  createBrowserRouter } from "react-router-dom";

import App from '../App';
import Error from '../pages/Error/Error';
import Home from "../pages/Home/Home";
import Operation from "../pages/Operation/Operation";
import Board from "../pages/Board/Board";

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
        children: [
          {
            path: "",
            element:  <Operation />,
          },
          {
            path: "board",
            element: <Board />,
          }
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default router;
