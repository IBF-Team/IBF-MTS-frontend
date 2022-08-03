import React, { useState } from 'react';
import {Link, Outlet } from 'react-router-dom';
import Home from './components/Home/Home'
import CookieConsent from "react-cookie-consent";
import './App.css'

function App() {
  const [token, setToken] = useState();
  const [drawOver, setDrawOver] = useState(false);
  return (
    <div>
      <Home />
      <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
      <Outlet />
    </div>
  )

}

export default App;
