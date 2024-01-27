import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes, // Only import Routes, Switch is not needed
} from "react-router-dom";

import Navbar from "./Components/Layout/Navbar";
import Landing from "./Components/Layout/Landing";
import Register from "./Components/.auth/Register"; // Make sure this path is correct
import Login from "./Components/auth/Login"; // Make sure this path is correct

import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} /> {/* No need for exact, as v6 uses exact matching by default */}
        {/* Routes for Register and Login inside a section */}
        <Route path="/Register" element={<section className="container"><Register /></section>} />
        <Route path="/Login" element={<section className="container"><Login /></section>} />
      </Routes>
    </Fragment>
  </Router>
);

export default App;
