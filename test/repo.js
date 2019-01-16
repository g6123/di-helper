import test from 'ava';
import { Context } from '../src';

test('Get from repository', t => {
  // Given
  const name = 'test-name';

  // When
  const context = new Context({ name });

  // Then
  t.is(Context.get(name), context);
});

test('Delete from repository', t => {
  // Given
  const name = 'test-name';
  const context = new Context({ name });

  // When
  Context.delete(name);

  // Then
  t.is(Context.get(name), undefined);
  t.not(Context.get(name), context);
});
