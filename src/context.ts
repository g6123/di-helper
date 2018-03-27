import * as Bluebird from 'bluebird'
import {merge} from 'lodash'

type ProviderDecorator = (
  (<T extends {(): {[key: string]: any}}>(target: T) => T) &
  MethodDecorator &
  PropertyDecorator
)

type ConsumerDecorator = (
  ((target: Function) => {(...args): any}) &
  MethodDecorator &
  PropertyDecorator
)

class Context {

  private modules = {}
  private providers = new Map()

  public provide = (modules: object) => {
    merge(this.modules, modules)
  }

  public resolve = async (key: string) => {
    if (this.modules[key] === undefined) {
      const provider = this.providers.get(key)

      if (provider === undefined) {
        throw new Error(`Cannot find provider for '${key}'`)
      }

      this.provide({
        [key]: null,
        ...(await provider()),
      })
    }

    return this.modules[key]
  }

  public resolveAll = async () => (
    Bluebird.each(this.providers.keys(), this.resolve)
  )

  public register = (key: string, provider) => {
    this.providers.set(key, provider)
  }

  public provides = (...keys: string[]): ProviderDecorator => (
    (target: any, propertyKey?: string, descriptor?: PropertyDescriptor): any => {
      const register = (provider) => {
        keys.forEach((key) => {
          this.register(key, provider)
        })
      }

      if (descriptor === undefined) {
        // Plain function call
        register(target)
        return target
      } else {
        // Property decorator
        register(descriptor.value)
      }
    }
  )

  public using = (...keys: string[]): ConsumerDecorator => (
    (target: any, propertyKey?: string, descriptor?: PropertyDescriptor): any => {
      const wrap = (consumer) => async (...ownArgs) => {
        const resolvedArgs = await Bluebird.mapSeries(keys, this.resolve)
        return consumer(...resolvedArgs, ...ownArgs)
      }
  
      if (descriptor === undefined) {
        // Plain function call
        return wrap(target)
      } else {
        // Property decorator
        descriptor.value = wrap(descriptor.value.bind(target))
      }
    }
  )
}

export default Context
