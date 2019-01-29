import React, { Component } from "react";
import Tomato from "../components/Tomato";
import { mmddyyyy } from "../utilities/datetime.ts";

class BigPicture extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const committed = this.props.committed || [];
    const blob = new Blob(
      [
        committed.map(c => {
          return c === "<NEWPARAGRAPH>" ? `\n` : c;
        })
      ], // Blob parts.
      {
        type: "text/plain;charset=utf-8"
      }
    );
    const downloadUrl = URL.createObjectURL(blob);
    const paragraphs = committed
      .reduce((a, e, i) => (e === "<NEWPARAGRAPH>" ? [...a, i] : a), [0])
      .map((newParagraphIndex, index, arrayOfIndexes) => {
        if (newParagraphIndex === arrayOfIndexes.length - 1) {
          return committed.slice(newParagraphIndex);
        } else {
          console.log("start", newParagraphIndex);
          console.log("end", arrayOfIndexes[newParagraphIndex]);
          return committed.slice(newParagraphIndex, arrayOfIndexes[index + 1]);
        }
      })
      .map(paragraphSubArray => {
        return paragraphSubArray
          .filter(s => s !== "<NEWPARAGRAPH>")
          .join(" ")
          .trim();
      });
    console.log("paragraphs", paragraphs);
    console.log("committed", committed);
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
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div>{paragraphs.reduce((a, e) => a + e.split(" ").length, 0)}</div>
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
      <Tomato>
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
              maxWidth: "900px",
              height: "80px",
              position: "center",
              margin: "0 auto"
            }}
          >
            <textarea
              style={{
                height: "50px",
                width: "100%",
                fontSize: "16px",
                fontFamily: "serif",
                border: "1px solid lightgray",
                resize: "none",
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
                  const newFragment =
                    inTheWorks === "" ? "<NEWPARAGRAPH>" : inTheWorks;
                  if (
                    committed[committed.length - 1] !== "<NEWPARAGRAPH>" ||
                    inTheWorks !== ""
                  ) {
                    this.setState({
                      committed: [...committed, newFragment],
                      inTheWorks: ""
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      </Tomato>
    );
  }
}

export default OneWay;
