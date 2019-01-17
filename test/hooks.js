import test from 'ava';
import { Context } from '../src';
import BaseHook from '../src/hook';

test('Add custom post-resolve hook', async t => {
  // Given
  const context = new Context();
  const key = 'test-key';
  const value = 'test-value';
  const hook = v => `${v}-hooked`;

  // When
  context.addHook(
    new class extends BaseHook {
      postResolve(args) {
        if (args.key === key) {
          return hook(args.value);
        } else {
          return super.postResolve(args);
        }
      }
    }(),
  );

  context.provide(key, value);

  // Then
  t.is(await context.resolve(key), hook(value));
});
