const logPrefix = "[Topsort Blocks]";

export const logger = {
  info: (...msg: any[]) => console.log(logPrefix, ...msg),
  warn: (...msg: any[]) => console.warn(logPrefix, ...msg),
  error: (...msg: any[]) => console.error(logPrefix, ...msg),
};
