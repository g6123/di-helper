import isCallable from 'is-callable';
import DependencyError from './error';

class Provider {
  getter = () => {
    throw new DependencyError('Provider is not defined');
  };

  dirty = false;
  value = null;

  constructor(context) {
    this.context = context;
  }

  as(value, options) {
    this.getter = () => value;
    this.options = { ...this.options, constant: true, ...options };
  }

  with(getter, options) {
    if (!isCallable(getter)) {
      throw new DependencyError('Getter must be callable');
    }

    this.getter = getter;
    this.options = { ...this.options, ...options };
  }

  aliasTo(key) {
    this.getter = () => this.context.resolve(key);
  }

  get() {
    if (!this.dirty) {
      this.value = this.getter();
      this.dirty = true;
    }

    return this.value;
  }
}

export default Provider;
