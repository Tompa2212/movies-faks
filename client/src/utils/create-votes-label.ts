export const createVotesLabel = (votes: number | null) => {
  if (!votes) {
    return 0;
  }

  if (votes < 1000) {
    return votes;
  }

  if (votes >= 1000 && votes < 1_000_000) {
    return `${Math.floor(votes / 1000)}K`;
  }

  return `${Math.floor(votes / 10000)}M`;
};
