import Context from './context';

export const context = new Context({ name: 'default' });
export const { provide, addProvider, addAlias, resolve, resolveAll, using } = context;

export { Context };
