import path from 'path';
import type { UserConfig } from 'vite';

export default (config: UserConfig): UserConfig => {
  const aiCjsEntry = path.resolve(
    __dirname, '..', '..', 'node_modules', 'ai', 'dist', 'index.js'
  );

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...((config.resolve?.alias as Record<string, string>) ?? {}),
        'ai': aiCjsEntry,
      },
    },
  };
};
