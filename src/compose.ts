import { initial, last } from "lodash";

const compose = (...fns) => (target) =>
  fns.length > 0 ? compose(...initial(fns))(last(fns)(target)) : target;

export default compose;
