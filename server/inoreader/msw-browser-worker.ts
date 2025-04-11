import { setupWorker } from 'msw/browser'
import { handlers } from './mock-handlers'
export const worker = setupWorker(...handlers)