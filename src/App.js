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


//PAGES
import  {Home } from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About"
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile"


function App() {
  return (
    
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
   <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

    

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
          {/* <Route path="dashboard/Settings" element={<Settings />} /> */}
          </Route>
        

         {/* 404 Page */}
         <Route path="*" element={<Error />} />
    </Routes>
   </div>
  );
}

export default App;
