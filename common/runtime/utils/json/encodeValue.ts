export const encodeValue = (val: any): string =>
  typeof val === "string" ? val : JSON.stringify(val);
