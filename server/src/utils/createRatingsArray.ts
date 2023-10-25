const MIN = 1;
const MAX = 10;

export function createRatingsArray(averageRating: number, totalVotes: number) {
  let sum = averageRating * totalVotes - totalVotes;

  // make sure there's always MIN rating value
  const ratings = new Array(totalVotes).fill(MIN);

  for (let i = 0; i < sum; i++) {
    let randIdx = Math.floor(Math.random() * sum) % totalVotes;

    // don't add rating greater than MAX
    while (ratings[randIdx] === MAX) {
      randIdx = Math.floor(Math.random() * sum) % totalVotes;
    }

    ratings[randIdx]++;
  }

  return ratings;
}
