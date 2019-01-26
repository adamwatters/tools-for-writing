import React, { Component } from "react";
import Pomodoro from "../components/Pomodoro";
import { mmddyyyy } from "../utilities/datetime";

class BigPicture extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const committed = this.props.committed || [];
    const blob = new Blob(
      [committed.join(" ")], // Blob parts.
      {
        type: "text/plain;charset=utf-8"
      }
    );
    const downloadUrl = URL.createObjectURL(blob);
    return (
      <div
        onMouseEnter={() => {
          if (committed.length) {
            this.setState({ active: true });
          }
        }}
        onMouseLeave={() => {
          this.setState({ active: false });
        }}
        style={{
          width: `280px`,
          position: "absolute",
          right: 0,
          top: 0,
          fontSize: "6px",
          lineHeight: "10px",
          opacity: 0.8,
          cursor: "pointer"
        }}
      >
        <p style={{ margin: 0 }}>{committed.join(" ")}</p>
        <div
          download={`tfw-ow-${mmddyyyy()}.txt`}
          onClick={this.props.clearCommitted}
          style={{
            position: "absolute",
            left: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "18px",
            right: "50%",
            top: 0,
            bottom: 0,
            color: "black",
            textDecoration: "none",
            transition: "opacity 300ms",
            backgroundColor: "white",
            opacity: this.state.active ? 0.8 : 0,
            pointerEvents: this.state.active ? "auto" : "none",
            cursor: "pointer"
          }}
        >
          <span>{`Clear`}</span>
        </div>
        <a
          download={`tfw-ow-${mmddyyyy()}.txt`}
          href={downloadUrl}
          style={{
            position: "absolute",
            left: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "18px",
            right: "0",
            top: 0,
            bottom: 0,
            color: "black",
            textDecoration: "none",
            transition: "opacity 300ms",
            backgroundColor: "white",
            opacity: this.state.active ? 0.8 : 0,
            pointerEvents: this.state.active ? "auto" : "none",
            cursor: "pointer"
          }}
        >
          <span>{`Download`}</span>
        </a>
      </div>
    );
  }
}

class OneWay extends Component {
  constructor() {
    super();
    const persistedStateString =
      typeof window !== `undefined`
        ? window.localStorage.getItem("oneway.state")
        : "{}";
    this.state = persistedStateString
      ? JSON.parse(persistedStateString)
      : {
          committed: [],
          inTheWorks: ""
        };
  }

  componentDidUpdate() {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem("oneway.state", JSON.stringify(this.state));
    }
  }

  render() {
    const { committed, inTheWorks } = this.state;
    return (
      <Pomodoro>
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: "30px",
            right: "30px",
            top: "30px",
            bottom: "30px",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <BigPicture
            clearCommitted={() => {
              this.setState({ committed: [] });
            }}
            committed={committed}
          />
          <div
            style={{
              width: `80%`,
              maxWidth: "500px",
              position: "center",
              margin: "0 auto"
            }}
          >
            <input
              style={{
                width: "100%",
                padding: "8px",
                outlineColor: "lightgreen"
              }}
              type="text"
              value={inTheWorks}
              onChange={e => {
                this.setState({ inTheWorks: e.target.value });
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  this.setState({
                    committed: [...committed, inTheWorks],
                    inTheWorks: ""
                  });
                }
              }}
            />
          </div>
        </div>
      </Pomodoro>
    );
  }
}

export default OneWay;
