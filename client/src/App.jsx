import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes, // Only import Routes, Switch is not needed
} from "react-router-dom";

import Navbar from "./Components/Layout/Navbar";
import Landing from "./Components/Layout/Landing";
import Register from "./Components/auth/Register"; // Make sure this path is correct
import Login from "./Components/auth/Login"; // Make sure this path is correct
import Alert from "./Components/Layout/Alert";
// Redux

import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/Alert"
            element={
              <section className="container">
                <Alert />
              </section>
            }
          />
          <Route
            path="/Register"
            element={
              <section className="container">
                <Register />
              </section>
            }
          />
          <Route
            path="/Login"
            element={
              <section className="container">
                <Login />
              </section>
            }
          />
        </Routes>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
