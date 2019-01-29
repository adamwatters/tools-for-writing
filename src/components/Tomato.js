import React, { Component } from "react";
import Timer from "./Timer";

class Pomodoro extends Component {
  renderSegments(segments) {
    return segments.map((s, i) => {
      if (s.status === "complete") {
        return (
          <div
            key={i}
            style={{
              width: "18px",
              height: "18px",
              backgroundColor:
                s.segmentType === "work"
                  ? "rgb(16, 188, 94)"
                  : "rgb(244, 134, 65)",
              borderRadius: "50%",
              margin: "3px"
            }}
          />
        );
      }
      return (
        <div
          key={i}
          style={{
            width: "18px",
            height: "18px",
            position: "relative",
            lineHeight: "24px",
            fontSize: "14px",
            textAlign: "center",
            backgroundColor:
              s.segmentType === "work"
                ? "rgb(16, 188, 94, .3)"
                : "rgb(244, 134, 65, .3)",
            margin: "3px"
          }}
        >
          <div
            style={{
              backgroundColor:
                s.segmentType === "work"
                  ? "rgb(16, 188, 94, 1)"
                  : "rgb(244, 134, 65, 1)",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${((s.segmentLength - s.remaining) / s.segmentLength) *
                100}%`
            }}
          />
        </div>
      );
    });
  }

  renderBreakWall(breakTimeRemaining) {
    return (
      !!breakTimeRemaining && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            color: "white",
            backgroundColor: "black",
            opacity: 0.8
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            {`Break Time - ${breakTimeRemaining}  second${
              breakTimeRemaining === 1 ? "" : "s"
            } remaining`}
          </div>
        </div>
      )
    );
  }

  renderPausedWall(timerState, unpauseClock) {
    return (
      !!timerState.paused && (
        <div
          onClick={unpauseClock}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            color: "white",
            backgroundColor: "black",
            opacity: 0.8
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            PAUSED (click anywhere to unpause)
          </div>
        </div>
      )
    );
  }

  render() {
    return (
      <Timer
        render={(
          timerState,
          startClock,
          resetClock,
          pauseClock,
          unpauseClock,
          segments,
          breakTimeRemaining
        ) => {
          return (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8
              }}
            >
              {timerState.started ? (
                this.props.children
              ) : (
                <button onClick={startClock}>Start</button>
              )}
              <div
                onClick={() => {
                  if (
                    window.confirm(
                      "Is it an emergency? Do not deviate from the Tomato System lightly"
                    )
                  ) {
                    pauseClock();
                  }
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                  opacity: 0.8
                }}
              >
                PAUSE
              </div>
              <div
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to reset the timer?")
                  ) {
                    resetClock();
                  }
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "row",
                  opacity: 0.8
                }}
              >
                {this.renderSegments(segments)}
              </div>
              {this.renderBreakWall(breakTimeRemaining)}
              {this.renderPausedWall(timerState, unpauseClock)}
            </div>
          );
        }}
      />
    );
  }
}

export default Pomodoro;
