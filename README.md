# di-helper

A concise JavaScript dependency injector

```javascript
import {provides, using} from 'di-helper'

provides('logger')(() => {
  return {logger: console.log}
})

using('logger')((logger) => {
  logger('The logger has been injected')
})
```

## Usage

### Install

```
yarn add di-helper
```

### Import

`di-heper` is built into UMD package, which supports both ESM, CommonJS, etc..

```javascript
// Default instance and its methods
import context, {provides, using} from 'di-helper'
const {default: context, provides, using} = require('di-helper')

// Context class
import {Context} from 'di-helper'
const {Context} = require('di-helper')

// Utility functions
import {compose} from 'di-helper'
const {compose} = require('di-helper')
```

## Methods

### `provide(modules: object)`

Simply adds modules to the current context.
Each key of the `modules` argument becomes the key for [`resolve()`](#resolvekey-string-promiseany).

```javascript
context.provide({
  logger: console.log,
})
```

### `register(key: string, provider: () => (any | Promise<any>))`

Registers provider to the current context.

 - `providers` argument is a function that returns (eventually) module that corresponds to the `key`.
 - `key` argument becomes the key for [`resolve()`](#resolvekey-string-promiseany).

```javascript
context.register('logger', () => {
  return console.log
})
```

### `resolve(key: string): Promise<any>`

Resolves the module that has been provided with the `key`.
The modules are cached once resolved.

```javascript
context.resolve('logger').then((logger) => {
  logger('The logger has been resolved')
})
```

### `resolveAll(pattern?: (string | string[] | (key: string) => boolean | RegExp)): Promise`

Executes all providers that matches the pattern and cache the results not resolved yet.

 - When no arguments given, all providers are matched.
 - `string`: Test if the provider's key euqals.
 - `string[]`: Test if the provider's key is included.
 - `(key: string) => boolean`: Test if `true` is returned when the provider's key is given.
 - `RegExp`: Test the provider's key by the given expression.

```javascript
context.resolveAll()
```

## Annotation Factories

`di-helper` has been designed to support only high-order function and method/property decorator.

### `provides(...keys: string[])`

Registers a target as a provider for the `keys`.

If a provider returns the modules, all its keys should be listed in the decorator.

Otherwise, a provider can return `undefined` or `{}`.
In this case, [`resolve()`](#resolvekey-string-promiseany) for the `keys` listed only executes the provider.

```javascript
context.provides('logger')(() => {
  return {logger: console.log}
})
```

```javascript
class Logger {

  // ...

  @provides('logger')
  static provide() {
    return {logger: new Logger()}
  }
}
```

### `using(...keys: string[])`

Wraps a target and inject the modules for the `keys`.
The resolved modules are prepended to its own arguments when the wrapped function gets called.
The resulting function wrapped by this decorator returns `Promise` eventually resolved into the original return value.

```javascript
context.using('logger')((logger) => {
  logger('The logger has been injected')
})
```

```javascript
class UserModel {

  // ...

  async update(id, user) {
    return updateUser(id, user)
      .then(() => this.log(`Updated user ${id}`))
      .catch(() => this.log(`Error occurred updating user ${id}`))
  }

  @using('logger')
  log(logger, message) {
    const time = new Date().toDateString()
    logger(`[${time}] ${message}`)
  }
}
```
