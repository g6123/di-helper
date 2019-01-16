import isCallable from 'is-callable';
import BaseHook from './BaseHook';

const ENABLED = Symbol('LAZY_HOOK_ENABLED');
const VALUE = Symbol('LAZY_HOOK_VALUE');

class LazyHook extends BaseHook {
  onProvide(key, value, originalValue, options) {
    const isDisabled = options && options.lazy === false;

    const wrappedValue = {
      [ENABLED]: isCallable(value) && !isDisabled,
      [VALUE]: value,
    };

    return wrappedValue;
  }

  onResolve(key, wrappedValue, originalValue, options) {
    const value = wrappedValue[VALUE];

    if (wrappedValue[ENABLED]) {
      return value();
    } else {
      return super.onResolve(key, value, originalValue, options);
    }
  }
}

export default LazyHook;
