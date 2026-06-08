import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {

  async login(email: string, password: string) {

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

   const token = jwt.sign(
  {
    perfil: user.perfil,
  },
  process.env.JWT_SECRET as string,
  {
    subject: user.id,
    expiresIn: "1d",
  }
  
);
return {
    user,
    token,
  };
}
};