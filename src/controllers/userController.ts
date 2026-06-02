import { Request, Response } from "express"
import { UserService } from "../services/userService"

const userService = new UserService();

export class UserController{
    async create(request:Request, response:Response){
        const { nome, email, password, perfil, universityId } = request.body;

        const user = await userService.create(
            nome,
            email,
            password,
            perfil,
            universityId
        );

        return response.status(201).json(user)
    }
}