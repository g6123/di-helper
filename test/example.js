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
  await provide('obj').with(() => {
    return obj;
  });

  const greet = using(['obj'], resolvedObj => {
    resolvedObj.update();
  });

  await greet();

  // Then
  t.is(obj.flag, true);
});
