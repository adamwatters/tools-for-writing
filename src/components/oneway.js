import React from 'react'
import Pomodoro from '../components/pomodoro.js'

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

class BigPicture extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    let downloadUrl
    const committed = this.props.committed || []
    if (typeof Blob !== `undefined`) {
      const blob = new Blob(
        [committed.join(' ')], // Blob parts.
        {
          type: 'text/plain;charset=utf-8',
        }
      )
      downloadUrl = URL.createObjectURL(blob)
    } else {
      downloadUrl = ''
    }
    return (
      <div
        onMouseEnter={() => {
          if (committed.length) {
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
          fontSize: '6px',
          lineHeight: '10px',
          opacity: 0.8,
          cursor: 'pointer',
        }}
      >
        <p style={{ margin: 0 }}>{committed.join(' ')}</p>
        <div
          download={`tfw-ow-${formattedDate}.txt`}
          onClick={this.props.clearCommitted}
          style={{
            position: 'absolute',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
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
          <span>{`Clear`}</span>
        </div>
        <a
          download={`tfw-ow-${formattedDate}.txt`}
          href={downloadUrl}
          style={{
            position: 'absolute',
            left: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
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
          <span>{`Download`}</span>
        </a>
      </div>
    )
  }
}

class OneWay extends React.Component {
  constructor() {
    super()
    const persistedStateString =
      typeof window !== `undefined`
        ? window.localStorage.getItem('oneway.state')
        : '{}'
    this.state = persistedStateString
      ? JSON.parse(persistedStateString)
      : {
          committed: [],
          inTheWorks: '',
        }
  }

  componentDidUpdate() {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem('oneway.state', JSON.stringify(this.state))
    }
  }

  render() {
    const { committed, inTheWorks } = this.state
    return (
      <Pomodoro>
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
        </div>
      </Pomodoro>
    )
  }
}

export default OneWay
