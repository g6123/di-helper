import * as chai from 'chai'
import * as spies from 'chai-spies'

import Context from '../src/context'
import Provider from '../src/provider'

const {expect} = chai

chai.use(spies)

describe('Context {}', () => {
  let context: Context

  beforeEach(() => {
    context = new Context()
  })

  it('Context#provide() and Context#resolve()', async () => {
    // Given
    const key1 = 'test-key1'
    const value1 = 'test-value1'

    const key2 = 'test-key2'
    const value2 = 'test-value2'

    // When
    context.provide({
      [key1]: value1,
      [key2]: value2,
    })

    // Then
    expect(await context.resolve(key1)).to.be.eq(value1)
    expect(await context.resolve(key2)).to.be.eq(value2)
  })

  it('Context#register() and Context#resolveAll()', async () => {
    // Given
    const key1 = 'test-key1'
    const provider1 = chai.spy()

    const key2 = 'test-key2'
    const provider2 = chai.spy()

    // When
    context.register(key1, provider1)
    context.register(key2, provider2)

    await context.resolveAll()

    // Then
    expect(provider1).to.be.called()
    expect(provider2).to.be.called()
})

describe('Context#register() and Context#resolve()', () => {
    it('With syncronous provider', async () => {
      // Given
      const key = 'test-key'
      const value = 'test-value'
      const provider = () => ({[key]: value})

      // When
      context.register(key, provider)

      // Then
      expect(await context.resolve(key)).to.be.eq(value)
    })

    it('With asyncronous provider', async () => {
      // Given
      const key = 'test-key'
      const value = 'test-value'
      const provider = async () => await ({[key]: value})

      // When
      context.register(key, provider)

      // Then
      expect(await context.resolve(key)).to.be.eq(value)
    })
  })

  describe('Context#provides() and Context#resolve()', () => {
    it('Via plain function call', async () => {
      // Given
      const key = 'test-key'
      const value = 'test-value'

      // When
      context.provides(key)(() => ({
        [key]: value
      }))

      // Then
      expect(await context.resolve(key)).to.be.eq(value)
    })

    it('Via class decorator', async () => {
      // Given
      const key = 'test-key'

      // When
      @context.provides(key)
      class Class extends Provider {}

      // Then
      expect(await context.resolve(key)).to.be.instanceOf(Class)
    })

    it('Via method decorator', async () => {
      // Given
      const key = 'test-key'
      const value = 'test-value'

      // When
      class Class {

        @context.provides(key)
        method() {
          return {[key]: value}
        }
      }

      // Then
      expect(await context.resolve(key)).to.be.eq(value)
    })
  })

  describe('Context#provide() and Context#using()', () => {
    it('Via plain function call', async () => {
      // Given
      const key1 = 'test-key1'
      const value1 = 'test-value1'

      const key2 = 'test-key2'
      const value2 = 'test-value2'

      context.provide({
        [key1]: value1,
        [key2]: value2,
      })

      // When
      const fn = (value1, value2) => ({value1, value2})
      const wrappedFn = context.using(key1, key2)(fn)
      const result = await wrappedFn()

      // Then
      expect(result.value1).to.be.eq(value1)
      expect(result.value2).to.be.eq(value2)
    })

    it('Via method decorator', async () => {
      // Given
      const key1 = 'test-key1'
      const value1 = 'test-value1'

      const key2 = 'test-key2'
      const value2 = 'test-value2'

      context.provide({
        [key1]: value1,
        [key2]: value2,
      })

      // When
      class Class {

        result: any

        @context.using(key1, key2)
        method(...args) {
          const [value1, value2] = args
          this.result = {value1, value2}
        }
      }

      // Then
      const instance = new Class()
      await instance.method()

      expect(instance.result.value1).to.be.eq(value1)
      expect(instance.result.value2).to.be.eq(value2)
    })
  })

  describe('Error cases', () => {
    it('Resolving module not provided by any providers', async () => {
      // Given
      const key = 'test-key'

      // When
      let error = null

      await context.resolve(key).catch((_error) => {
        error = _error
      })

      // Then
      expect(error).to.be.instanceof(Error)
    })
  })
})
