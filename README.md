# di-helper

A concise JavaScript dependency injector

```javascript
import {provides, using} from 'di-helper'

provides('logger')(() => {
  return {logger: console.log}
})

using('logger')((logger) => {
  logger('The logger is injected!')
})
```

## Methods

### `provide(modules: any)`

### `register(key: string, provider: () => any)`

### `resolve(key: string): Promise<any>`

### `resolveAll(): Promise`

## Annotation Factories

### `provides(...keys)`

### `using(...keys)`
