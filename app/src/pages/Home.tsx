import React, { Component } from "react";
import { Link } from "@reach/router";

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Tool Directory</h1>
        <div>
          <Link to="/onward">Onward</Link>
          <p>a tool to start writing and keep going</p>
        </div>
      </div>
    );
  }
}

export default Home;
