import isCallable from 'is-callable';
import BaseHook from './BaseHook';

const ENABLED = Symbol('LAZY_HOOK_ENABLED');
const VALUE = Symbol('LAZY_HOOK_VALUE');

class LazyHook extends BaseHook {
  onProvide(key, value, originalValue, options) {
    if (options !== undefined && options !== null && options.lazy !== undefined) {
      return { [ENABLED]: !!options.lazy, [VALUE]: value };
    } else {
      return { [ENABLED]: isCallable(value), [VALUE]: value };
    }
  }

  onResolve(key, wrappedValue, originalValue, options) {
    const value = wrappedValue[VALUE];

    if (options !== undefined && options !== null && options.lazy !== undefined) {
      if (options.lazy) {
        return value();
      } else {
        return super.onResolve(key, value, originalValue, options);
      }
    } else {
      if (wrappedValue[ENABLED]) {
        return value();
      } else {
        return super.onResolve(key, value, originalValue, options);
      }
    }
  }
}

export default LazyHook;
