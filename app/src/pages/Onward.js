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
    const paragraphs = committed
      // initialize accumulator with a zero because the first paragraph should be sliced from 0
      .reduce((a, e, i) => (e === "<NEWPARAGRAPH>" ? [...a, i] : a), [0])
      .map((newParagraphIndex, index, arrayOfIndexes) => {
        if (newParagraphIndex === committed.length - 1) {
          return committed.slice(newParagraphIndex);
        } else {
          return committed.slice(newParagraphIndex, arrayOfIndexes[index + 1]);
        }
      })
      .map(paragraphSubArray => {
        return paragraphSubArray
          .filter(s => s !== "<NEWPARAGRAPH>")
          .join(" ")
          .trim();
      });
    const blob = new Blob([paragraphs.join(`\n`)], {
      type: "text/plain;charset=utf-8"
    });
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
        {paragraphs.map((p, i) => (
          <p
            style={{
              minHeight: "10px",
              backgroundColor:
                i === paragraphs.length - 1 ? "rgba(0,0,0,.05)" : "white"
            }}
            key={i}
          >
            {p}
          </p>
        ))}
        <div>{console.log(paragraphs)}</div>
        <div>
          {paragraphs
            .filter(a => a !== "")
            // return length, or if 0 return empty string
            .reduce((a, e) => a + e.split(" ").length, 0) || ""}
        </div>
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
              maxWidth: "700px",
              height: "80px",
              position: "center",
              margin: "0 auto",
              display: "flex",
              alignContent: "stretch",
              justifyItems: "stretch"
            }}
          >
            <textarea
              style={{
                height: "50px",
                fontSize: "16px",
                fontFamily: "serif",
                border: "1px solid lightgray",
                resize: "none",
                padding: "8px",
                outlineColor: "lightgreen",
                flex: "1 1 auto"
              }}
              type="text"
              value={inTheWorks}
              onChange={e => {
                this.setState({ inTheWorks: e.target.value });
              }}
              onKeyDown={e => {
                const { committed } = this.state;
                if (e.key === "Backspace") {
                  // e.preventDefault();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (inTheWorks !== "") {
                    this.setState({
                      committed: [...committed, inTheWorks],
                      inTheWorks: ""
                    });
                  }
                }
                if (e.key === "Tab") {
                  e.preventDefault();
                  // do not allow newparagraph in first position or two in a row
                  if (
                    committed[committed.length - 1] !== "<NEWPARAGRAPH>" &&
                    committed.length !== 0
                  ) {
                    this.setState({
                      committed: [...committed, "<NEWPARAGRAPH>"]
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
