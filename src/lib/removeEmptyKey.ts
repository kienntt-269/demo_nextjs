export function removeEmptyKeys(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmptyKeys(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    } else if (
      obj[key] === '' ||
      obj[key] === '""' ||
      obj[key] === "''" ||
      obj[key] === null ||
      obj[key] === undefined
    ) {
      delete obj[key];
    }
  });
  return obj;
}
