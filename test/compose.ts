import { expect } from "chai";

import compose from "../src/compose";

it("compose()", () => {
  // Given
  const i = 1;
  const fn1 = (a) => a * 2;
  const fn2 = (b) => b + 1;

  // When
  const result = compose(
    fn1,
    fn2,
  )(i);

  // Then
  expect(result).to.be.eq(fn1(fn2(i)));
});
