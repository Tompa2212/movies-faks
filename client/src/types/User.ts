export type User = {
  id: number;
  email: string;
  password: string | null;
  username: string | null;
  firstName: string;
  lastName: string | null;
  active: boolean | null;
  emailVerified: Date | null;
  image: string | null;
};

export type NewUser = {
  email: string;
  password: string | null;
  username: string | null;
  firstName: string;
  lastName: string | null;
  active: boolean | null;
  emailVerified: Date | null;
  image: string | null;
};

export type SessionUser = Pick<
  User,
  'email' | 'id' | 'username' | 'firstName' | 'image'
>;
