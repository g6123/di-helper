class BaseHook {
  postResolve({ key, value, originalValue, options }) {
    return value;
  }
}

export default BaseHook;
