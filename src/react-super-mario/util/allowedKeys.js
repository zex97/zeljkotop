// @flow

type keys = {
  ArrowLeft: boolean,
  ArrowRight: boolean,
  ArrowUp: boolean,
  ArrowDown: boolean,
  Space: boolean,
  KeyA: boolean,
  KeyS: boolean,
  KeyZ: boolean,
  KeyX: boolean,
}

const allowedKeys: keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Space: false,
  KeyA: false,
  KeyS: false,
  KeyZ: false,
  KeyX: false,
}

export default allowedKeys

export type allowedKeysType = typeof allowedKeys
