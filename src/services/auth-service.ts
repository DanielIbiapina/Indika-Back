import { UserRepository } from "../repositories/user-repository";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async login(data: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatch = await compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  // ... outros métodos do service
}
