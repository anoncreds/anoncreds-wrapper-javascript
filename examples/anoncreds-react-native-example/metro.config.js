const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

// The example is part of the pnpm workspace, so Expo configures watchFolders and nodeModulesPaths for the workspace root
const config = getDefaultConfig(projectRoot)

// Bundle the packages from source, so the app doesn't need them built. `expo start` maps them with the tsconfig paths,
// but React Native Harness runs Metro without Expo's CLI.
const packageSources = {
  '@hyperledger/anoncreds-react-native': path.resolve(workspaceRoot, 'packages/anoncreds-react-native/src/index.ts'),
  '@hyperledger/anoncreds-shared': path.resolve(workspaceRoot, 'packages/anoncreds-shared/src/index.ts'),
}

const resolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (packageSources[moduleName]) return { type: 'sourceFile', filePath: packageSources[moduleName] }

  // The tests in packages/anoncreds-shared/tests also run on Node.js with Vitest. In the app, React Native Harness
  // provides the same describe / test / expect (its expect is Vitest's)
  if (moduleName === 'vitest') return context.resolveRequest(context, 'react-native-harness', platform)

  return (resolveRequest ?? context.resolveRequest)(context, moduleName, platform)
}

// Expo serves the bundle from the workspace root (`/examples/anoncreds-react-native-example/src/index.bundle`), but React
// Native Harness resolves its entry point and test files from the server root. Under Harness, which sets RN_HARNESS,
// serve from the example instead.
if (process.env.RN_HARNESS) {
  const examplePrefix = `/${path.relative(config.server.unstable_serverRoot, projectRoot)}/`
  const rewriteRequestUrl = config.server.rewriteRequestUrl

  config.server.unstable_serverRoot = projectRoot
  config.server.rewriteRequestUrl = (url) => {
    const rewritten = new URL(rewriteRequestUrl(url), 'http://localhost')
    if (rewritten.pathname.startsWith(examplePrefix)) {
      rewritten.pathname = `/${rewritten.pathname.slice(examplePrefix.length)}`
    }
    return url.startsWith('/') ? `${rewritten.pathname}${rewritten.search}` : rewritten.toString()
  }
}

module.exports = config
