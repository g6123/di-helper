import test from 'ava';
import { Context } from '../src';
import BaseHook from '../src/hooks/BaseHook';

test('Lazy resolve hook', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const value = 'test-value';

  // When
  context.provide(key, () => value);

  // Then
  t.is(await context.resolve(key), value);
});

test('Lazy resolve hook disabled', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const value = 'test-value';
  const lazyValue = () => value;

  // When
  context.provide(key, lazyValue, { lazy: false });

  // Then
  t.is(await context.resolve(key), lazyValue);
  t.not(await context.resolve(key), value);
});

test('Add hook for provide()', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const inputValue = 'test-value';
  const hookedValue = `${inputValue}-hooked`;

  // When
  context.addHook(
    new class extends BaseHook {
      onProvide(key, value, originalValue, options) {
        if (value === inputValue) {
          return hookedValue;
        } else {
          return super.onProvide(key, value, options);
        }
      }
    }(),
  );

  context.provide(key, inputValue);

  // Then
  t.is(await context.resolve(key), hookedValue);
});

test('Add hook for resolve()', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const inputValue = 'test-value';
  const hookedValue = `${inputValue}-hooked`;

  // When
  context.addHook(
    new class extends BaseHook {
      onResolve(key, value, originalValue, options) {
        if (value === inputValue) {
          return hookedValue;
        } else {
          return super.onResolve(key, value, options);
        }
      }
    }(),
  );

  context.provide(key, inputValue);

  // Then
  t.is(await context.resolve(key), hookedValue);
});
