export const initials = (...args: string[]) => {
  return args.map((value) => value[0].toLocaleUpperCase()).join('');
};
