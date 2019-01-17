import autobind from 'autobind-decorator';
import Promise from 'bluebird';
import isCallable from 'is-callable';
import DependencyError from './error';
import Provider from './provider';

class Context {
  static repo = {};

  static get(name) {
    return Context.repo[name];
  }

  static delete(name) {
    delete Context.repo[name];
  }

  _providers = {};

  constructor(name) {
    this.name = name;

    if (name) {
      Context.repo[name] = this;
    }
  }

  @autobind
  provide(key) {
    const provider = new Provider(this);
    this._providers[key] = provider;
    return provider;
  }

  @autobind
  resolve(key) {
    const provider = this._providers[key];

    if (provider === undefined) {
      return Promise.reject(new DependencyError(`Cannot find provider for: ${key}`));
    } else {
      return Promise.resolve(provider.get());
    }
  }

  @autobind
  resolveAll(cond) {
    if (Array.isArray(cond)) {
      return Promise.resolve(cond)
        .map(c => this.resolveAll(c))
        .reduce((acc, item) => [...acc, ...item], [])
        .filter(values => !!values);
    }

    if (cond instanceof RegExp) {
      return Promise.resolve(Object.keys(this._providers))
        .filter(key => cond.test(key))
        .map(key => this.resolve(key))
        .filter(values => !!values);
    }

    if (isCallable(cond)) {
      return Promise.resolve(Object.keys(this._providers))
        .filter(cond)
        .map(key => this.resolve(key))
        .filter(values => !!values);
    }

    if (cond === undefined || cond === true) {
      return Promise.resolve(Object.keys(this._providers))
        .map(key => this.resolve(key))
        .filter(values => !!values);
    }

    if (cond === null || cond === false) {
      return Promise.resolve([]);
    }

    return this.resolve(cond)
      .then(value => [value])
      .filter(values => !!values);
  }

  @autobind
  using(cond, consumer) {
    return (...ownArgs) => this.resolveAll(cond).then(values => consumer(...values, ...ownArgs));
  }
}

export default Context;
