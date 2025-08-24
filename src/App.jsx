


// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Home from "./Ui/Home";

// import Cart from "./features/Cart1/Cart"; // adjust to your actual Cart component path
// import Order from "./features/Order/Order"; // ✅ your Order page
// import { getOrder } from "./Services/apiRestaurant";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "cart",
//     element: <Cart />,
//   },
//   {
//     path: "Order/:OrderId",   // ✅ added this
//     element: <Order />,
//     loader: async ({ params }) => {
//       // params.orderId will be like "2ZMNCS"
//      // return 
//       getOrder(params.orderId);
//     },
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

/////




import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Ui/Home";
import Error from "./Ui/Error";
import Menu, { loader as menuLoader } from "./features/Menu/Menu";
import Cart from "./features/Cart1/Cart";

import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";

import Order, { loader as orderLoader } from "./features/order/Order";

//import {loader as updateOrderAction} from  './features/order/UpdateOrder'

import { action as updateOrderAction } from "./features/order/UpdateOrder"

import AppLayout from "./Ui/AppLayout";




const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,



      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
