import test from 'ava';
import { Context } from '../src';

test('Simple resolve through using()', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const value = 'test-value';
  let resolvedValue;

  // When
  context.provide(key).as(value);

  await context.using([key], v => {
    resolvedValue = v;
  })();

  // Then
  t.is(resolvedValue, value);
});

test('Resolve through using() with additional arguments', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const value1 = 'test-value1';
  const value2 = 'test-value1';
  let resolvedValues;

  // When
  context.provide(key).as(value1);

  await context.using([key], (v1, v2) => {
    resolvedValues = [v1, v2];
  })(value2);

  // Then
  t.is(resolvedValues[0], value1);
  t.is(resolvedValues[1], value2);
});
