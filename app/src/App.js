import React, { Component } from "react";
import { Router, Link } from "@reach/router";
import Home from "./pages/Home";
import Onward from "./pages/Onward";

class App extends Component {
  render() {
    return (
      <div>
        <header style={{ zIndex: 2, position: "relative" }}>
          <Link to="/">Tools For Writing</Link>
        </header>
        <Router>
          <Home path="/" />
          <Onward path="onward" />
        </Router>
      </div>
    );
  }
}

export default App;
