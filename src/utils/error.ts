import { flatten, type ValiError } from 'valibot';

export const getValiErrorMessages = <T extends ValiError<any>>(err: T) => {
  const { root = [], nested = {} } = flatten(err.issues);
  return [
    err.message,
    ...root,
    ...Object.entries(nested).map(([key, value]) => `[${key}] ${value}`),
  ];
};