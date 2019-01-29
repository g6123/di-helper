/**
 * A condition whether or not to match dependency.
 *  - If the value is a `string`, resolves dependency with the same key.
 *  - If the value is a `RegExp`, resolves dependency with the key matching the regular expression.
 *  - If the value is a function, use it as a predicator against the key.
 *  - If the value is `true`, resolves all.
 *  - If the value is `false` or `null`, resolves none.
 *  - If the value is an array of conditions, resolves any dependencies matching at least one condition.
 *    (i.e. logical *OR*)
 *
 * @typedef {(string|RegExp|conditionCallback|boolean|null|Condition[])} Condition
 */

/**
 * @callback conditionCallback
 * @param {string} key The dependency's key.
 * @returns {boolean} If the dependency should be resolved or not.
 */
