import isCallable from 'is-callable';
import DependencyError from './error';

/**
 * @class
 */
class Provider {
  constructor(context) {
    this.context = context;
  }

  _getter = () => {
    throw new DependencyError('Provider is not defined');
  };

  _dirty = false;
  _value = null;

  /**
   * Define provider by a just simple `value`.
   *
   * @param {*} value The value.
   * @param {Object} options The options. (For the future use)
   *
   * @example
   * context.provide('logger').as(console.log);
   */
  as(value, options) {
    this._getter = () => value;
    this.options = { ...this.options, constant: true, ...options };
  }

  /**
   * Define provider by a getter function.
   * The provider will provide a value returned by the function.
   *
   * @param {Function} getter The getter function.
   * @param {Object} options The options. (For the future use)
   *
   * @example
   * context.provide('logger').with(() => {
   *   return console.log;
   * });
   */
  with(getter, options) {
    if (!isCallable(getter)) {
      throw new DependencyError('Getter must be callable');
    }

    this._getter = getter;
    this.options = { ...this.options, ...options };
  }

  /**
   * Define provider by an alias to another depedency.
   *
   * @param {string} key The key of another dependency.
   *
   * @example
   * context.provide('logger').aliasTo('println');
   */
  aliasTo(key) {
    this._getter = () => this.context.resolve(key);
  }

  get() {
    if (!this._dirty) {
      this._value = this._getter();
      this._dirty = true;
    }

    return this._value;
  }
}

export default Provider;
