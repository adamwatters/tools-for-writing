import React from 'react'

const today = new Date()
let dd = today.getDate()
let mm = today.getMonth() + 1 //January is 0!
let yyyy = today.getFullYear()

if (dd < 10) {
  dd = '0' + dd
}

if (mm < 10) {
  mm = '0' + mm
}

const formattedDate = mm + '/' + dd + '/' + yyyy

class Timer extends React.Component {
  constructor() {
    super()
    this.config = [
      { segmentType: 'work', segmentLength: 20 },
      { segmentType: 'break', segmentLength: 5 },
      { segmentType: 'work', segmentLength: 20 },
      { segmentType: 'break', segmentLength: 5 },
      { segmentType: 'work', segmentLength: 20 },
      { segmentType: 'break', segmentLength: 5 },
      { segmentType: 'work', segmentLength: 20 },
    ]
    this.state = {
      clock: 1,
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        clock: this.state.clock + 1,
      })
    }, 60000)
  }
  render() {
    let distributableTime = this.state.clock
    const segments = []
    let isBreak = false
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
          isBreak = true
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
      <div>
        {isBreak && (
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
              Take a Break
            </div>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'row',
            opacity: 0.8,
          }}
        >
          {segments.map((s, i) => {
            if (s.status === 'complete') {
              return (
                <div
                  key={i}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'black',
                    opacity: 0.8,
                    borderRadius: '50%',
                    margin: '1px',
                  }}
                />
              )
            }
            return (
              <div
                key={i}
                style={{
                  width: '24px',
                  height: '24px',
                  lineHeight: '24px',
                  fontSize: '14px',
                  textAlign: 'center',
                  transition: 'opacity 300ms',
                  opacity: s.status === 'active' ? 1 : 0.3,
                  margin: '1px',
                }}
              >
                {`${s.status === 'active' ? s.remaining + 1 : s.segmentLength}`}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

class BigPicture extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    const blob = new Blob(
      [this.props.committed.join(' ')], // Blob parts.
      {
        type: 'text/plain;charset=utf-8',
      }
    )
    const downloadUrl = URL.createObjectURL(blob)
    return (
      <div
        onMouseEnter={() => {
          if (this.props.committed.length) {
            this.setState({ active: true })
          }
        }}
        onMouseLeave={() => {
          this.setState({ active: false })
        }}
        style={{
          width: `280px`,
          position: 'absolute',
          right: 0,
          top: 0,
          fontSize: '7px',
          lineHeight: '11px',
          opacity: 0.8,
          cursor: 'pointer',
        }}
      >
        <p style={{ margin: 0 }}>{this.props.committed.join(' ')}</p>
        <div
          download={`tfw-ow-${formattedDate}.txt`}
          onClick={this.props.clearCommitted}
          style={{
            position: 'absolute',
            left: '0',
            textAlign: 'center',
            lineHeight: '100%',
            fontSize: '18px',
            right: '50%',
            top: 0,
            bottom: 0,
            color: 'black',
            textDecoration: 'none',
            transition: 'opacity 300ms',
            backgroundColor: 'white',
            opacity: this.state.active ? 0.8 : 0,
            pointerEvents: this.state.active ? 'auto' : 'none',
            cursor: 'pointer',
          }}
        >
          {`Clear`}
        </div>
        <a
          download={`tfw-ow-${formattedDate}.txt`}
          href={downloadUrl}
          style={{
            position: 'absolute',
            left: '50%',
            textAlign: 'center',
            lineHeight: '100%',
            fontSize: '18px',
            right: '0',
            top: 0,
            bottom: 0,
            color: 'black',
            textDecoration: 'none',
            transition: 'opacity 300ms',
            backgroundColor: 'white',
            opacity: this.state.active ? 0.8 : 0,
            pointerEvents: this.state.active ? 'auto' : 'none',
            cursor: 'pointer',
          }}
        >
          {`Download`}
        </a>
      </div>
    )
  }
}

class OneWay extends React.Component {
  constructor() {
    super()
    const persistedStateString = localStorage.getItem('oneway.state')
    this.state = persistedStateString
      ? JSON.parse(persistedStateString)
      : {
          committed: [],
          inTheWorks: '',
        }
  }

  componentDidUpdate() {
    localStorage.setItem('oneway.state', JSON.stringify(this.state))
  }

  render() {
    const { committed, inTheWorks } = this.state
    return (
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: '30px',
          right: '30px',
          top: '30px',
          bottom: '30px',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <BigPicture
          clearCommitted={() => {
            this.setState({ committed: [] })
          }}
          committed={committed}
        />
        <div
          style={{
            width: `80%`,
            maxWidth: '500px',
            position: 'center',
            margin: '0 auto',
          }}
        >
          <input
            style={{
              width: '100%',
              padding: '8px',
              outlineColor: 'lightgreen',
            }}
            type="text"
            value={inTheWorks}
            onChange={e => {
              this.setState({ inTheWorks: e.target.value })
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                this.setState({
                  committed: [...committed, inTheWorks],
                  inTheWorks: '',
                })
              }
            }}
          />
        </div>
        <Timer />
      </div>
    )
  }
}

export default OneWay
