# di-helper

<a href="http://npmjs.com/di-helper">
  <img src="https://img.shields.io/npm/v/di-helper.svg?style=flat-square" alt="npm">
</a>

A concise JavaScript dependency injector

```javascript
import { provide } from 'di-helper';

provide('logger').as(console.log);

// ...

import { using } from 'di-helper';

const greet = using((['logger'], (log, name) => {
  log(`Hello ${name}!`);
});

greet('world');
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

## API

See [API documentation](https://g6123.github.io/di-helper/).
