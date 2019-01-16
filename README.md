# di-helper

<a href="http://npmjs.com/di-helper">
  <img src="https://img.shields.io/npm/v/di-helper.svg?style=flat-square" alt="npm">
</a>

A concise JavaScript dependency injector

```javascript
import context from 'di-helper';

context.provide('logger', () => {
  return console.log;
});

context.using((['logger'])(logger => {
  logger('The logger has been injected');
});
```

## Usage

### Install

`di-heper` is built into UMD package, which supports both ESM, CommonJS, etc..

```javascript
// Default instance and its wrapper method
import context, { defaultUsing } from 'di-helper';
const { default: context, usingDefault: using } = require('di-helper');

// Context class
import { Context } from 'di-helper';
const { Context } = require('di-helper');
```

## Methods

### `provide()`

_WIP_

### `resolve()`

_WIP_

### `resolveAll()`

_WIP_

### `using()`

_WIP_
