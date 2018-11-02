import compose from "./compose";
import Context from "./context";

const defaultContext = new Context();
const { provides, using } = defaultContext;

export default defaultContext;
export { compose, Context, provides, using };
