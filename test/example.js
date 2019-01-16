import test from 'ava';
import context from '../src';

test('Example from README', async t => {
  // Given
  const obj = {
    flag: false,
    update() {
      this.flag = true;
    },
  };

  // When
  await context.provide('obj', () => {
    return obj;
  });

  await context.using(['obj'])(resolvedObj => {
    resolvedObj.update();
  })();

  // Then
  t.is(obj.flag, true);
});
