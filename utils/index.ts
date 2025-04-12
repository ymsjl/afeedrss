export const extractFirst = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  } else {
    return value;
  }
};