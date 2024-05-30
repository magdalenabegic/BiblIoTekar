export const $try = <TRet, TFallback = null>(
  fn: (...args: never[]) => TRet,
  fallback?: TFallback,
  finallyFn?: () => unknown,
) => {
  try {
    return fn();
  } catch {
    return (fallback ?? null) as TFallback extends null | undefined
      ? null
      : TFallback;
  } finally {
    finallyFn?.();
  }
};

export const $tryAsync = async <TRet, TFallback = null>(
  fn: (...args: never[]) => Promise<TRet>,
  fallback?: TFallback,
  finallyFn?: () => unknown,
) => {
  try {
    return await fn();
  } catch (e: unknown) {
    console.error(e);

    return (fallback ?? null) as TFallback extends null | undefined
      ? null
      : TFallback;
  } finally {
    finallyFn?.();
  }
};
