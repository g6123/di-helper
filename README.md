# di-helper

<a href="http://npmjs.com/di-helper">
  <img src="https://img.shields.io/npm/v/di-helper.svg?style=flat-square" alt="npm">
</a>

A concise JavaScript dependency injector

```javascript
import { provide } from 'di-helper';

provide('logger').with(() => {
  return console.log;
});

// ...

import { using } from 'di-helper';

const greet = using((['logger'], log => {
  log('The logger has been injected');
});

greet();
```

## Usage

### Install

`di-heper` is built into UMD package, which supports both ESM, CommonJS, etc..

```javascript
// Default instance and its methods
import { context, provide, resolve, resolveAll, using } from 'di-helper';
const { context, provide, resolve, resolveAll, using } = require('di-helper');

// Context class
import { Context } from 'di-helper';
const { Context } = require('di-helper');
```

## Methods

_WIP_
