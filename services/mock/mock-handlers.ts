import streamMockHandles from '../inoreader/stream.mock'
import suscriptionMocksHandles from '../inoreader/subscription.mock'
import userMockHandles from '../inoreader/user.mock'

export const handlers = [
  ...streamMockHandles,
  ...suscriptionMocksHandles,
  ...userMockHandles
]