/* eslint-disable no-unused-vars */
import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Main from "../Main";
import Registration from "../Registration";
import Dashboard from "../Dashboard";
import MyCart from "../MyCart";
import AddClass from "../Instructor/AddClass";
import MyClasses from "../Instructor/MyClasses";
import AllClasses from "../Admin/AllClasses";
import UpdateClass from "../Instructor/UpdateClass";
import ManageUsers from "../Admin/ManageUsers";
import InstructorPage from "../InstructorPage";
import ClassesPage from "../ClassesPage";
import PrivateRoute from "../../provider/PrivateRoute";
import Payment from "../../Payment/Payment";
import Notfound from "../Notfound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },  
      {
        path: "/login",
        element: <Login></Login>,
      },  
      { 
        path: "registration",
        element: <Registration></Registration>,
      },  
      { 
        path: "instructorpage",
        element: <InstructorPage></InstructorPage>
      },
      { 
        path: "classespage",
        element: <ClassesPage></ClassesPage>
      }
    ]
  },
  {
    path: "dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        path: "cart",
        element: <MyCart></MyCart>
      },
      {
        path: "addclass",
        element: <AddClass></AddClass>
      },
      {
        path: "myclass",
        element: <MyClasses></MyClasses>
      },
      {
        path: "allclass",
        element: <AllClasses></AllClasses>,
        loader: ({ params }) => fetch('https://summer-camp-server-two-topaz.vercel.app/classes')
      },
      {
        path: "updateclass/:id",
        element: <UpdateClass></UpdateClass>,
        loader: ({ params }) => fetch(`https://summer-camp-server-two-topaz.vercel.app/classes/${params.id}`)
      },
      {
        path: "manageusers",
        element: <ManageUsers></ManageUsers>
        // loader: ({ params }) => fetch('https://summer-camp-server-two-topaz.vercel.app/users')
      },
      {
        path: "payment",
        element: <Payment></Payment>
      },
    ]  
  },
  {
    path: "*",
    element: <Notfound></Notfound>
  },

]);

export default router;