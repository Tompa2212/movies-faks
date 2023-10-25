import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hash = async (value: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(value, salt);

  return hash;
};

export const hashCompare = async (hashed: string, value: string) => {
  const match = await bcrypt.compare(hashed, value);
  return match;
};
