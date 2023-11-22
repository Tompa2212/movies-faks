export const createDurationLabel = (duration: number | null) => {
  if (!duration) {
    return 0;
  }

  if (duration < 60) {
    return `${duration}m`;
  }

  const hrs = Math.floor(duration / 60);
  const mins = duration - hrs * 60;

  return `${hrs}h ${mins}m`;
};
