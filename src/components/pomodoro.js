import React from 'react'

class Pomodoro extends React.Component {
  constructor() {
    super()
    this.config = [
      { segmentType: 'work', segmentLength: 1200 },
      { segmentType: 'break', segmentLength: 300 },
      { segmentType: 'work', segmentLength: 1200 },
      { segmentType: 'break', segmentLength: 300 },
      { segmentType: 'work', segmentLength: 1200 },
      { segmentType: 'break', segmentLength: 300 },
      { segmentType: 'work', segmentLength: 1200 },
    ]
    const persistedStateString =
      typeof window !== `undefined`
        ? window.localStorage.getItem('pomodoro.state')
        : '{}'
    this.state = persistedStateString
      ? JSON.parse(persistedStateString)
      : {
          clock: 1,
          started: false,
        }
  }

  setClockInterval() {
    this.clockInterval = setInterval(() => {
      this.setState({
        clock: this.state.clock + 1,
      })
    }, 10)
  }

  resetClock() {
    clearInterval(this.clockInterval)
    this.setState({ started: false, clock: 1 })
  }

  startClock() {
    this.setState({ started: true })
    this.setClockInterval()
  }

  componentDidMount() {
    // if state is booted from local storage
    if (this.state.started) {
      this.setClockInterval()
    }
  }

  componentDidUpdate() {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem('pomodoro.state', JSON.stringify(this.state))
    }
  }

  renderSegments(segments) {
    return segments.map((s, i) => {
      if (s.status === 'complete') {
        return (
          <div
            key={i}
            style={{
              width: '18px',
              height: '18px',
              backgroundColor:
                s.segmentType === 'work'
                  ? 'rgb(16, 188, 94)'
                  : 'rgb(244, 134, 65)',
              borderRadius: '50%',
              margin: '3px',
            }}
          />
        )
      }
      return (
        <div
          key={i}
          style={{
            width: '18px',
            height: '18px',
            position: 'relative',
            lineHeight: '24px',
            fontSize: '14px',
            textAlign: 'center',
            backgroundColor:
              s.segmentType === 'work'
                ? 'rgb(16, 188, 94, .3)'
                : 'rgb(244, 134, 65, .3)',
            margin: '3px',
          }}
        >
          <div
            style={{
              backgroundColor:
                s.segmentType === 'work'
                  ? 'rgb(16, 188, 94, 1)'
                  : 'rgb(244, 134, 65, 1)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${((s.segmentLength - s.remaining) / s.segmentLength) *
                100}%`,
            }}
          />
        </div>
      )
    })
  }

  renderBreakWall(breakTimeRemaining) {
    return (
      !!breakTimeRemaining && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'black',
            opacity: 0.8,
          }}
        >
          <div style={{ textAlign: 'center', width: '100%' }}>
            {`Break Time - ${breakTimeRemaining}  second${
              breakTimeRemaining === 1 ? '' : 's'
            } remaining`}
          </div>
        </div>
      )
    )
  }

  render() {
    let distributableTime = this.state.clock
    const segments = []
    let breakTimeRemaining = null
    this.config.forEach(s => {
      if (distributableTime === 0) {
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength,
          status: 'future',
        })
      } else if (distributableTime <= s.segmentLength) {
        if (s.segmentType === 'break') {
          breakTimeRemaining = s.segmentLength - distributableTime
        }
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength - distributableTime,
          status: 'active',
        })
        distributableTime = 0
      } else if (distributableTime > s.segmentLength) {
        segments.push({
          segmentType: s.segmentType,
          segmentLength: s.segmentLength,
          remaining: s.segmentLength - distributableTime,
          status: 'complete',
        })
        distributableTime = distributableTime - s.segmentLength
      }
    })
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
        }}
      >
        {this.state.started ? (
          this.props.children
        ) : (
          <button onClick={() => this.startClock()}>Start</button>
        )}
        <div
          onClick={() => {
            if (window.confirm('Are you sure you want to reset the timer?')) {
              this.resetClock()
            }
          }}
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'row',
            opacity: 0.8,
          }}
        >
          {this.renderSegments(segments)}
        </div>
        {this.renderBreakWall(breakTimeRemaining)}
      </div>
    )
  }
}

export default Pomodoro
