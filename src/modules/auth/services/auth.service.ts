import { UserRepository } from "../../users/repositories/user.repository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { env } from "../../../config/env.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { LoginDTO, RegisterDTO } from "../schemas/auth.schema.js";

export class AuthService {
    private readonly repository = new UserRepository();

    async register(data:RegisterDTO){
        const emailExists = await this.repository.findByEmail(data.email)
        if(emailExists){
            throw new AppError(409,"Email ya registrado")
        }
        const hashedpassword = await bcrypt.hash(data.password,10)
        const newUser = await this.repository.create({
            name:data.name,
            email:data.email,
            password: hashedpassword
        })
        const {password,...user} = newUser
        return user
    }

    async login(data:LoginDTO){
        const user = await this.repository.findByEmail(data.email)
        if(!user){
            throw new AppError(409, "No hay usuarios registrados con ese email")
        }
        const correctPassword = await bcrypt.compare(data.password,user.password)
        if (!correctPassword) {
            throw new AppError(401, "Credenciales inválidas");
        }
        const {password, ...userWithoutPassword} = user
        const token = jwt.sign(
            {userId: user.id},
            env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        return{
            user: userWithoutPassword,
            token,
        }
    }
}