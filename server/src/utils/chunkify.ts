export function chunkify<T>(array: T[], chunkSize: number) {
  const chunked = [];

  let chunks = Math.floor(array.length / chunkSize);

  if (array.length / chunkSize !== chunks) {
    chunks++;
  }

  for (let i = 0; i < chunks; i++) {
    const cursor = i * chunkSize;

    chunked[i] = array.slice(cursor, cursor + chunkSize);
  }

  return chunked;
}
