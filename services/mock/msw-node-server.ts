import { setupServer } from 'msw/node'
import { mockHandlers as streamMockHandles } from '../stream'
import { mockHandlers as suscriptionMocksHandles } from '../subscription'
import { mockHandlers as userMockHandles } from '../user'

const handlers = [
  ...streamMockHandles,
  ...suscriptionMocksHandles,
  ...userMockHandles
]

export const server = setupServer(...handlers)