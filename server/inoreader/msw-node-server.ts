import { setupServer } from 'msw/node'
import { handlers } from './mock-handlers'

export const server = setupServer(...handlers)