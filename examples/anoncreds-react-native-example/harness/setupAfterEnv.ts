import { afterEach } from 'react-native-harness'

// The anoncreds calls are synchronous, so a test file keeps the JS thread busy from start to end unless it yields.
// Harness drops the app when it doesn't answer its heartbeat for 20 seconds, so give the event loop a turn after each test
afterEach(() => new Promise((resolve) => setTimeout(resolve, 0)))
