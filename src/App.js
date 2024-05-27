import { useEffect } from "react"
import "./App.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

//COMPONENTS

import  Navbar  from "./components/Common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
//DASHBOARD PAGE COMPONENTS
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
//instructors ka kaam hai
import MyCourses from "./components/core/Dashboard/MyCourses"
import AddCourse from "./components/core/Dashboard/AddCourse"
import EditCourse from "./components/core/Dashboard/EditCourse"
// import Instructor from "./components/core/Dashboard/Instructor"
//PAGES
import  {Home } from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About"
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import CourseDetails from "./pages/CourseDetails"
import Catalog from "./pages/Catalog"
import Error from "./pages/Dashboard";
//protected routes

import { ACCOUNT_TYPE } from "./utils/constants";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)
  return (

    
    
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
   <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />

    
  {/* Open Route - for Only Non Logged in User */}
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

<Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

<Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

<Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />


         {/* Private Route - for Only Logged in User */}
         <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/Settings" element={<Settings />} />


  {/* FOR STUDENTS */}
      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />

          </>
        )
      }
      {/* //FOR THE INSTRUCTOR */}
      {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}

    </Route>

    

    <Route path="*" element={<Error />} />


    </Routes>

   </div>
  );
}

export default App;
