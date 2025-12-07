# Anoncreds NodeJS

Wrapper for Nodejs and React Native around [Anoncreds RS](https://github.com/anoncreds/anoncreds-rs)

## Requirements

This library requires (and has been tested extensively with) Node.js version 18.x. Newer versions might also work, but they have not been tested.

## Installation

```sh
yarn add @hyperledger/anoncreds-nodejs
# or
yarn add @hyperledger/anoncreds-react-native
```

## Usage

You can import all types and classes from the `@hyperledger/anoncreds-nodejs` or `@hyperledger/anoncreds-react-native` library:

```typescript
import { Schema } from '@hyperledger/anoncreds-nodejs'

const schema = Schema.create({
  name: 'test',
  version: '1.0',
  issuerId: 'mock:uri',
  attributeNames: ['name', 'age', 'address']
})

// JSON representation
const schemaJson = schema.toJson()

// This can be used as a deconstructor to clear the internal reference to
// the anoncreds object
schema.handle.clear()
```

> **Note**: If you want to use this library in a cross-platform environment you need to import methods from the `@hyperledger/anoncreds-shared` package instead. This is a platform independent package that allows to register the native bindings. The `@hyperledger/anoncreds-nodejs` package uses this package under the hood. See the [Anoncreds Shared README](https://github.com/anoncreds/anoncreds-wrapper-javascript/tree/main/packages/anoncreds-shared/README.md) for documentation on how to use this package.

## Version Compatibility

The JavaScript wrapper is versioned independently from the native bindings. The following table shows the compatibility between the different versions:

| Anoncreds | JavaScript Wrapper |
| --------- | ------------------ |
| v0.2.x    | v0.3.x             |
