import Context from './context';

export const context = new Context({ name: 'default' });
export const { provide, alias, resolve, resolveAll, using } = context;

export { Context };
