import React, { PureComponent } from 'react'
import { hot } from 'react-hot-loader/root'

import Button from 'components/Button'

import style from 'lib/style'

import list from './list'

import './styles.css'

const REFRESH_PER_SEC = 10
const SECONDS = 60

// No X Q Z
const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'Y',
]

const a = new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

function beep(vol, freq, duration) {
  const v = a.createOscillator()
  const u = a.createGain()
  v.connect(u)
  v.frequency.value = freq
  v.type = 'square'
  u.connect(a.destination)
  u.gain.value = vol * 0.01
  v.start(a.currentTime)
  v.stop(a.currentTime + duration * 0.001)
}

class App extends PureComponent {
  state = {
    players: { Jared: 0, Jacy: 0, Kelsey: 0 },
    round: 0,
    remaining: null,
  }

  clearIntervals = () => {
    if (this.timer) clearInterval(this.timer)
    if (this.beeper) clearInterval(this.beeper)
  }

  addPoint = player => {
    this.setState(({ players }) => ({ players: { ...players, [player]: players[player] + 1 } }))
  }

  removePoint = player => {
    this.setState(({ players }) => ({ players: { ...players, [player]: players[player] - 1 } }))
  }

  nextRound = () => {
    this.clearIntervals()
    this.setState(({ round }) => ({ round: round + 1, remaining: null }))
  }

  previousRound = () => {
    this.clearIntervals()
    this.setState(({ round }) => ({ round: round - 1, remaining: null }))
  }

  startTimer = () => {
    this.setState({
      remaining: SECONDS * REFRESH_PER_SEC,
      letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
    })
    this.timer = setInterval(() => {
      this.setState(
        ({ remaining }) => ({
          remaining: remaining - 1,
        }),
        () => {
          const { remaining } = this.state
          if (remaining === 0) {
            this.clearIntervals()
            this.beeper = setInterval(() => beep(100, 500, 100), 200)
          }
        },
      )
    }, 1000 / REFRESH_PER_SEC)
  }

  clearTimer = () => {
    this.clearIntervals()
    this.setState({ remaining: null })
  }

  render() {
    const { round, remaining, letter, players } = this.state
    return (
      <div className="center" styleName={style({ flashing: remaining === 0 })}>
        <div styleName="header">
          <div>Round {round + 1}</div>
          <div styleName="timer">
            <div>
              {remaining || remaining === 0 ? (remaining / REFRESH_PER_SEC).toFixed(1) : '---'}
            </div>
            {remaining === null ? (
              <Button onClick={this.startTimer} styleName="green">
                Start
              </Button>
            ) : (
              <Button onClick={this.clearTimer} styleName="red">
                Clear
              </Button>
            )}
          </div>
          <div>{letter}</div>
        </div>
        <div styleName="words" className="mt4">
          {list[round].map((line, idx) => (
            <div key={line} className="pb3 ml4">
              <div className="inline-block w5">{idx + 1}.</div>
              <span className="ml2">{line}</span>
            </div>
          ))}
        </div>
        <div styleName="players">
          {Object.entries(players).map(([player, score]) => (
            <div key={player} className="pv2 mt4" styleName="name">
              <div>{player}</div>
              <div className="inline-block ml2">
                <Button
                  onClick={() => this.removePoint(player)}
                  variant="outlined"
                  className="mr3"
                  styleName="red"
                >
                  -
                </Button>
                {score}
                <Button
                  onClick={() => this.addPoint(player)}
                  variant="outlined"
                  className="ml3"
                  styleName="green"
                >
                  +
                </Button>
              </div>
            </div>
          ))}
          <div className="mt4 pt4">
            <Button
              onClick={this.previousRound}
              styleName="previous"
              variant="outlined"
              className="mr2"
              disabled={round === 0}
            >
              Prev
            </Button>
            <Button
              onClick={this.nextRound}
              styleName="next"
              variant="outlined"
              className="ml2"
              disabled={round === list.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

// react-hot-loader automatically does not run when process.env === 'production'
export default hot(App)
