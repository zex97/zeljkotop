// @flow
import React from 'react'
import toastr from 'toastr'
import Background from './components/Background'
import Mario from './components/Player'
import Touchable from './components/Touchable'
import ButtonInfo from './components/Buttons/info'
import InfoBox from './components/Infobox'
import allowedKeys from './util/allowedKeys'
import variables from './util/variables'
import music from './assets/audio/mp.wav'
import intro from './assets/audio/mpi.wav'
import jumpAudio from './assets/audio/smw_jump.wav'
import infoAudio from './assets/audio/smw_message_block.wav'
import './ReactSuperMario.css'

type Props = {}

type State = {
  width?: number,
  positionX: number,
  positionY: number,
  scenarioPosition: number,
  direction: 'ltr' | 'rtl',
  isMoving: boolean,
  isJumping: boolean,
  isFalling: boolean,
  displayInfo: boolean,
  userIsTouching: boolean,
  userTouchingX: number,
  userTouchingY: number,
}

export default class ReactSuperMario extends React.Component<Props, State> {

  constructor() {
    super();
    this.musicElement = React.createRef();
  }

  state = {
    width: 0,
    positionX: 0,
    positionY: 0,
    scenarioPosition: 0,
    direction: 'ltr',
    isMoving: false,
    isJumping: false,
    isFalling: false,
    displayInfo: false,
    userIsTouching: false,
    userTouchingX: 0,
    userTouchingY: 0,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchmove', this.handleTouchMove)
    window.addEventListener('touchend', this.handleTouchEnd)
    this._gameCoreRunTimeout = setInterval(this.gameCoreRun, 80)
    toastr.success('Move with arrow LEFT/RIGHT <br/>Run with A or S <br/>Jump with Z or Space Bar', 'Instructions', { timeOut: 5000 })
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeventListener('touchend', this.handleTouchEnd)
    clearInterval(this._gameCoreRunTimeout)
  }

  _gameCoreRunTimeout: IntervalID;
  _activeKeys: typeof allowedKeys = allowedKeys;
  _gameContainerRef: ?HTMLDivElement;
  _audioRef: ?HTMLAudioElement;
  _audioSfxRef: ?HTMLAudioElement;

  restart() {
    clearInterval(this._gameCoreRunTimeout)
    this._gameCoreRunTimeout = setInterval(this.gameCoreRun, 80)
  }

  gameCoreRun = () => {
    const { direction, positionX, positionY, width, scenarioPosition, isJumping, isFalling } = this.state;
    const { _activeKeys } = this;
    const step = _activeKeys.KeyA || _activeKeys.KeyS ?  20 : 10;
    const jumpLimit = 120;

    // Movement
    if (_activeKeys.ArrowRight ? !_activeKeys.ArrowLeft : _activeKeys.ArrowLeft) {
      this.setState({ isMoving: true });
      if (direction === 'ltr' && _activeKeys.ArrowLeft) {
        this.setState({ direction: 'rtl' });
      } else if (direction === 'rtl' && _activeKeys.ArrowRight) {
        this.setState({ direction: 'ltr' });
      }
      if (_activeKeys.ArrowRight && width && positionX > (width * 40 / 100)) {
        this.setState({ scenarioPosition: scenarioPosition + step });
      } else if (_activeKeys.ArrowLeft && positionX <= step && scenarioPosition > 0) {
        this.setState({ scenarioPosition: scenarioPosition - step });
      } else if (_activeKeys.ArrowRight && width && positionX < (width - variables.marioWidth - step)) {
        this.setState({ positionX: positionX + step });
      } else if (_activeKeys.ArrowLeft && positionX > 0) {
        this.setState({ positionX: positionX - step });
      }
    } else {
      this.setState({ isMoving: false });
    }

    // Jump
    if ((_activeKeys.KeyZ || _activeKeys.Space) && !isFalling) {
      if (!isJumping && this._audioRef && !this._audioRef.muted) {
        this._audioSfxRef.src = jumpAudio
        this._audioSfxRef.play()
      }
      this.setState({ isJumping: true })
      if (positionY < jumpLimit) {
        this.setState({ positionY: positionY + 30 })
      } else {
        this.setState({ isFalling: true })
      }
    } else {
      if (positionY > 0) {
        const nextPositionY = positionY - (_activeKeys.KeyZ || _activeKeys.Space ? 30 : 40)
        this.setState({ isFalling: true, positionY: nextPositionY >= 0 ? nextPositionY : 0 })
      } else {
        this.setState({ isJumping: false, isFalling: _activeKeys.KeyZ || _activeKeys.Space })
      }
    }
  }

  handleTouchStart = (event: TouchEvent) => {
    this.setState({
      userIsTouching: true,
      userTouchingX: event.touches[0].clientX,
      userTouchingY: event.touches[0].clientY,
    })
  }

  handleTouchEnd = () => {
    this.setState({
      userIsTouching: false,
      userTouchingX: 0,
      userTouchingY: 0,
    })
    this._activeKeys.ArrowRight = false
    this._activeKeys.ArrowLeft = false
    this._activeKeys.KeyA = false
    this._activeKeys.KeyZ = false
    this._activeKeys.Space = false
  }

  handleTouchMove = (event: TouchEvent) => {
    const { userTouchingX, userTouchingY } = this.state
    const diffX = event.touches[0].clientX - userTouchingX
    const diffY = userTouchingY - event.touches[0].clientY

    if (Math.abs(diffX) > 100) {
      this._activeKeys.KeyA = true
    } else {
      this._activeKeys.KeyA = false
    }
    if (diffX > 20) {
      this._activeKeys.ArrowRight = true
      this._activeKeys.ArrowLeft = false
    } else if (diffX < -20) {
      this._activeKeys.ArrowLeft = true
      this._activeKeys.ArrowRight = false
    }

    if (diffY > 40) {
      this._activeKeys.KeyZ = true
      this._activeKeys.Space = true
    } else {
      this._activeKeys.keyZ = false
      this._activeKeys.Space = false
    }
  }

  handleGameInfo = () => {
    clearInterval(this._gameCoreRunTimeout)
    if (this._audioSfxRef && this._audioRef && !this._audioRef.muted) {
      this._audioSfxRef.src = infoAudio
      this._audioSfxRef.play()
    }
    this.setState({ displayInfo: true, isFalling: true, positionY: 60 })
  }

  getRef = (ref: ?HTMLDivElement) => {
    if (ref) {
      this._gameContainerRef = ref;
      this.setState({ width: ref.clientWidth })
    }
  }

  keyDown = (event: KeyboardEvent) => {
    const { _activeKeys, state: { displayInfo } } = this
    if (_activeKeys[event.code] === false ) {
      _activeKeys[event.code] = true
      if (displayInfo) {
        this.setState({ displayInfo: false })
        this.restart()
      }
    }
  }

  keyUp = (event: KeyboardEvent) => {
    const { _activeKeys } = this;
    if (_activeKeys[event.code] === true ) {
      _activeKeys[event.code] = false;
    }
  }

  changeMusicState = () => {
    if (!this._audioRef) {
      this._audioSfxRef = new Audio();
      this._audioRef = new Audio(intro);
      this._audioRef.muted = true;
      this._audioRef.pause();
      this._audioRef.onended = () => {
        this._audioRef.src = music;
        this._audioRef.loop = true;
        if (!this._audioRef.muted) {
          this._audioRef.play();
        }
      };
    }

    if (this._audioRef.muted) {
      this._audioSfxRef.muted = false;
      this._audioRef.muted = false;
      this._audioRef.play();
    } else {
      this._audioSfxRef.muted = true;
      this._audioRef.muted = true;
    }
  }

  render() {
    const {
      positionX,
      positionY,
      direction,
      isMoving,
      isJumping,
      scenarioPosition,
      displayInfo,
    } = this.state
    return (
      <div className="ReactSuperMario" ref={this.getRef}>
        <Background position={scenarioPosition} callback={this.changeMusicState}/>
        <Mario
          positionX={positionX}
          positionY={positionY}
          direction={direction}
          isMoving={isMoving}
          isJumping={isJumping}
        />
        <Touchable
          onTouch={this.handleGameInfo}
          active={displayInfo}
          scenarioPosition={scenarioPosition}
          positionX={200}
          positionY={150}
          playerPositionX={positionX}
          playerPositionY={positionY}
        >
          <ButtonInfo />
        </Touchable>
        {displayInfo && (
          <InfoBox>
            {/*<h2>React JS Super Mario</h2>*/}
            {/*<p>*/}
            {/*  Check the source code*/}
            {/*  {' '}*/}
            {/*  <a href="https://github.com/fabiopaiva/react-super-mario" target="_blank" rel="noopener noreferrer">*/}
            {/*    <i className="fab fa-github fa-2x" />*/}
            {/*  </a>*/}
            {/*</p>*/}
            {/*<br />*/}
            {/*<h2>Follow me:</h2>*/}
            {/*<p>*/}
            {/*  <a href="https://github.com/fabiopaiva" target="_blank" rel="noopener noreferrer">*/}
            {/*    <i className="fab fa-github fa-2x" />*/}
            {/*  </a>*/}
            {/*  {' '}*/}
            {/*  <a href="https://www.linkedin.com/in/fabio-dev/" target="_blank" rel="noopener noreferrer">*/}
            {/*    <i className="fab fa-linkedin fa-2x" />*/}
            {/*  </a>*/}
            {/*</p>*/}
          </InfoBox>
        )}
      </div>
    )
  }
}
