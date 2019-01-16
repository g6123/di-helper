import autobind from 'autobind-decorator';
import Promise from 'bluebird';
import isCallable from 'is-callable';
import { defaultHooks } from './hooks/';

class Context {
  static repo = {};

  static get(name) {
    return Context.repo[name];
  }

  static delete(name) {
    delete Context.repo[name];
  }

  modules = {};

  constructor({ name = null, hooks = defaultHooks } = {}) {
    this.name = name;
    this.hooks = [...hooks];

    if (name) {
      Context.repo[name] = this;
    }
  }

  @autobind
  addHook(hook) {
    this.hooks.unshift(hook);
    return this;
  }

  @autobind
  provide(key, originalValue, options = {}) {
    const { value } = this.hooks.reduce(
      (arg, hook) => {
        arg.value = hook.onProvide(arg.key, arg.value, arg.originalValue, arg.options);
        return arg;
      },
      {
        key,
        originalValue,
        value: originalValue,
        options,
      },
    );

    this.modules[key] = value;

    return this;
  }

  @autobind
  alias(key, existingKey) {
    this.modules[key] = this.modules[existingKey];
    return this;
  }

  @autobind
  resolve(key, options = {}) {
    const originalValue = this.modules[key];

    return Promise.resolve(this.hooks.reverse())
      .reduce(
        async (arg, hook) => {
          arg.value = await hook.onResolve(arg.key, arg.value, arg.originalValue, arg.options);
          return arg;
        },
        {
          key,
          originalValue,
          value: originalValue,
          options,
        },
      )
      .then(({ value }) => value);
  }

  @autobind
  resolveAll(cond, options = {}) {
    if (Array.isArray(cond)) {
      return Promise.resolve(cond)
        .map(c => this.resolveAll(c, options))
        .reduce((acc, item) => [...acc, ...item], [])
        .filter(values => !!values);
    }

    if (cond instanceof RegExp) {
      return Promise.resolve(Object.keys(this.modules))
        .filter(key => cond.test(key))
        .map(key => this.resolve(key, options))
        .filter(values => !!values);
    }

    if (isCallable(cond)) {
      return Promise.resolve(Object.keys(this.modules))
        .filter(cond)
        .map(key => this.resolve(key, options))
        .filter(values => !!values);
    }

    if (cond === undefined || cond === true) {
      return Promise.resolve(Object.keys(this.modules))
        .map(key => this.resolve(key, options))
        .filter(values => !!values);
    }

    if (cond === null || cond === false) {
      return Promise.resolve([]);
    }

    return this.resolve(cond, options)
      .then(value => [value])
      .filter(values => !!values);
  }

  @autobind
  using(cond, tags) {
    return consumer => (...ownArgs) => this.resolveAll(cond, tags).then(values => consumer(...values, ...ownArgs));
  }
}

export default Context;
