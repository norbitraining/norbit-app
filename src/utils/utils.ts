type Logger = (...args: any[]) => void;

export let log = null as unknown as Logger;

export const setLogger = (logger: Logger) => {
  log = logger;
};

export var EMPTY_FN = function () {};
