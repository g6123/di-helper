import test from 'ava';
import { provide, using } from '../src';

test('Example from README', async t => {
  // Given
  const obj = {
    flag: false,
    update() {
      this.flag = true;
    },
  };

  // When
  await provide('obj', () => {
    return obj;
  });

  await using(['obj'])(resolvedObj => {
    resolvedObj.update();
  })();

  // Then
  t.is(obj.flag, true);
});
