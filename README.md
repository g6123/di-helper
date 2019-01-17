# di-helper

<a href="http://npmjs.com/di-helper">
  <img src="https://img.shields.io/npm/v/di-helper.svg?style=flat-square" alt="npm">
</a>

A concise JavaScript dependency injector

```javascript
import { provide, using } from 'di-helper';

provide('logger', () => {
  return console.log;
});

using((['logger'])(logger => {
  logger('The logger has been injected');
});
```

## Usage

### Install

`di-heper` is built into UMD package, which supports both ESM, CommonJS, etc..

```javascript
// Default instance and its methods
import { context, provide, alias, resolve, resolveAll, using } from 'di-helper';
const { context, provide, alias, resolve, resolveAll, using } = require('di-helper');

// Context class
import { Context } from 'di-helper';
const { Context } = require('di-helper');
```

## Methods

_WIP_
