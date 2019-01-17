import Context from './context';

export const context = new Context('global');
export const { provide, resolve, resolveAll, using } = context;
