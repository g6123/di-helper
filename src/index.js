import Context from './context';

export const context = new Context({ name: 'default' });
export const { provide, resolve, resolveAll, using } = context;

export { Context };
