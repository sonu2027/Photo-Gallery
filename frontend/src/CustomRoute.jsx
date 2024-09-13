import { Route, Routes } from "react-router";
import React from 'react'
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Image from "./Image.jsx";
import Setting from "./Setting.jsx";
import Change from "./Change.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import ChangePassword from "./ChangePassword.jsx";
import DeleteAccount from "./DeleteAccount.jsx";
import Favorite from "./Favorite.jsx";

function CustomRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/forgotpassword/ChangePassword/:mail" element={<ChangePassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/image/:imageURL" element={<Image />} />
      <Route path="/api/v1/users/register" element={<Register />} />
      <Route path="/home/setting" element={<Setting />} />
      <Route path="/home/setting/:change" element={<Change />} />
      <Route path="/home/setting/accountdeleteion" element={<DeleteAccount />} />
      <Route path="/home/favorite" element={<Favorite />} />
    </Routes>
  )
}

export default CustomRoute