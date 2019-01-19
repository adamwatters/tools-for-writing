import React from 'react'

class BigPicture extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
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
          width: `240px`,
          position: 'absolute',
          right: 0,
          top: 0,
          fontSize: '7px',
          lineHeight: '11px',
          transition: 'opacity 300ms',
          opacity: this.state.active ? 0.8 : 0.5,
          cursor: 'pointer',
        }}
      >
        <p>{this.props.committed.join(' ')}</p>
        <button
          onClick={this.props.clearCommitted}
          style={{
            height: '30px',
            width: '30px',
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            fontSize: '7px',
            lineHeight: '11px',
            transition: 'opacity 300ms',
            opacity: this.state.active ? 1 : 0,
            pointerEvents: this.state.active ? 'auto' : 'none',
            cursor: 'pointer',
          }}
        >
          {`-->`}
        </button>
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
      </div>
    )
  }
}

export default OneWay
