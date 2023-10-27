export default class User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
  active: boolean;

  constructor({
    id,
    firstName,
    lastName,
    password,
    email,
    username,
    active
  }: {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    username: string;
    active: boolean;
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.username = username;
    this.active = active;
  }
}
