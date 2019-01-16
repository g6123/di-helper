import Context from './context';

const defaultContext = new Context({ name: 'default' });
const { using: usingDefault } = defaultContext;

export { Context, defaultContext, usingDefault };
export default defaultContext;
