class BaseHook {
  onProvide(key, value, originalValue, options) {
    return value;
  }

  onResolve(key, value, originalValue, options) {
    return value;
  }
}

export default BaseHook;
