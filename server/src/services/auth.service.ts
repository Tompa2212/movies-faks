import { UserRepository } from '../repository/user.repository';

const authService = (userRepository: UserRepository) => {
  return {
    async login(email: string, password: string) {}
  };
};

export default authService;

export type AuthService = ReturnType<typeof authService>;
