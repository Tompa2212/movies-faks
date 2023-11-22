export const getYearFromDate = (value: string | Date) => {
  if (value instanceof Date) {
    return value.getFullYear();
  }

  value = new Date(value);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value.getFullYear();
};
