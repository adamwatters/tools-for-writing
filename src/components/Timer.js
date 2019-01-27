import { Component } from "react";

class Timer extends Component {
  constructor() {
    super();
    this.config = [
      { segmentType: "work", segmentLength: 1200 },
      { segmentType: "break", segmentLength: 300 },
      { segmentType: "work", segmentLength: 1200 },
      { segmentType: "break", segmentLength: 300 },
      { segmentType: "work", segmentLength: 1200 },
      { segmentType: "break", segmentLength: 300 },
      { segmentType: "work", segmentLength: 1200 }
    ];
    const persistedStateString = window.localStorage.getItem("pomodoro.state");
    this.state = persistedStateString
      ? JSON.parse(persistedStateString)
      : {
          clock: 1,
          started: false
        };
  }
  setClockInterval() {
    this.clockInterval = setInterval(() => {
      this.setState({
        clock: this.state.clock + 1
      });
    }, 1000);
  }

  resetClock = () => {
    clearInterval(this.clockInterval);
    this.setState({ started: false, clock: 1 });
  };

  startClock = () => {
    this.setState({ started: true });
    this.setClockInterval();
  };

  componentDidMount() {
    // if state is booted from local storage
    if (this.state.started) {
      this.setClockInterval();
    }
  }

  componentDidUpdate() {
    window.localStorage.setItem("pomodoro.state", JSON.stringify(this.state));
  }

  render() {
    let distributableTime = this.state.clock;
    const segments = [];
    let breakTimeRemaining = null;
    this.config.forEach(s => {
      if (distributableTime === 0) {
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength,
          status: "future"
        });
      } else if (distributableTime <= s.segmentLength) {
        if (s.segmentType === "break") {
          breakTimeRemaining = s.segmentLength - distributableTime;
        }
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength - distributableTime,
          status: "active"
        });
        distributableTime = 0;
      } else if (distributableTime > s.segmentLength) {
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength - distributableTime,
          status: "complete"
        });
        distributableTime = distributableTime - s.segmentLength;
      }
    });
    return this.props.render(
      this.state,
      this.startClock,
      this.resetClock,
      segments,
      breakTimeRemaining
    );
  }
}

export default Timer;
