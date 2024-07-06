export const decodeValue = (val: any): object => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (_) {
      /* empty */
    }
  }

  return val;
};
