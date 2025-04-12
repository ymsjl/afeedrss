export const extractFirst = (value: string | string[] | undefined | null) => {
  if (Array.isArray(value)) {
    return value[0];
  } else {
    return value ?? '';
  }
};