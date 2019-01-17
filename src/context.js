import autobind from 'autobind-decorator';
import Promise from 'bluebird';
import isCallable from 'is-callable';
import DependencyError from './error';

const OPTIONS = Symbol('PROVIDER_OPTIONS');

class Context {
  static repo = {};

  static get(name) {
    return Context.repo[name];
  }

  static delete(name) {
    delete Context.repo[name];
  }

  _providers = {};
  _hooks = [];
  _modules = {};

  constructor({ name = null } = {}) {
    this.name = name;

    if (name) {
      Context.repo[name] = this;
    }
  }

  @autobind
  provide(key, value, provideOptions = {}) {
    return this.addProvider(key, () => value, { constant: true, ...provideOptions });
  }

  @autobind
  addProvider(key, provider, provideOptions = {}) {
    if (!isCallable(provider)) {
      throw new DependencyError('Provider must be callable');
    }

    this._providers[key] = provider;
    this._providers[key][OPTIONS] = provideOptions;

    return this;
  }

  @autobind
  addAlias(key, existingKey, provideOptions = {}) {
    return this.addProvider(key, () => this._providers[existingKey](), { alias: true, ...provideOptions });
  }

  @autobind
  addHook(hook) {
    this._hooks.push(hook);
    return this;
  }

  @autobind
  resolve(key, resolveOptions = {}) {
    if (this._modules.hasOwnProperty(key)) {
      return Promise.resolve(this._modules[key]);
    }

    if (!this._providers.hasOwnProperty(key)) {
      return Promise.reject(new DependencyError(`Cannot find provider: ${key}`));
    }

    const provider = this._providers[key];
    const options = { ...provider[OPTIONS], ...resolveOptions };

    return Promise.resolve(provider())
      .then(value => this._applyPostResolveHooks(key, value, options))
      .then(hookedValue => {
        this._modules[key] = hookedValue;
        return hookedValue;
      });
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
      return Promise.resolve(Object.keys(this._providers))
        .filter(key => cond.test(key))
        .map(key => this.resolve(key, options))
        .filter(values => !!values);
    }

    if (isCallable(cond)) {
      return Promise.resolve(Object.keys(this._providers))
        .filter(cond)
        .map(key => this.resolve(key, options))
        .filter(values => !!values);
    }

    if (cond === undefined || cond === true) {
      return Promise.resolve(Object.keys(this._providers))
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

  _applyPostResolveHooks(key, value, options) {
    return Promise.reduce(
      this._hooks,
      (arg, hook) =>
        Promise.resolve(hook.postResolve(arg)).then(value => {
          arg.value = value;
          return arg;
        }),
      { key, value, originalValue: value, options },
    ).then(({ value }) => value);
  }
}

export default Context;
