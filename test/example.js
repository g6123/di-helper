import test from 'ava';
import defaultContext, { usingDefault } from '../src';

test('Example from README', async t => {
  // Given
  const obj = {
    flag: false,
    update() {
      this.flag = true;
    },
  };

  // When
  await defaultContext.provide('obj', () => {
    return obj;
  });

  await usingDefault(['obj'])(resolvedObj => {
    resolvedObj.update();
  })();

  // Then
  t.is(obj.flag, true);
});
