export default class User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;

  constructor({
    id,
    firstName,
    lastName,
    password,
    email,
    username
  }: {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    username: string;
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.username = username;
  }
}
