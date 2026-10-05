import { UserRepository } from "../../users/repositories/user.repository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { env } from "../../../config/env.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { LoginDTO, RegisterDTO } from "../schemas/auth.schema.js";
import { SessionRepository } from "../repositories/session.repository.js";
import { th } from "zod/locales";
import { decode } from "node:punycode";

interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export class AuthService {
    private readonly repository = new UserRepository();
    private readonly sessionRepository = new SessionRepository()

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
            throw new AppError(401, "Credenciales inválidas")
        }
        const correctPassword = await bcrypt.compare(data.password,user.password)
        if (!correctPassword) {
            throw new AppError(401, "Credenciales inválidas");
        }
        const {password, ...userWithoutPassword} = user

        const accessToken = jwt.sign(
            {
                userId: user.id,
            },
            env.JWT_ACCESS_SECRET,
            {
                expiresIn: "15m"
            }
        )

        const expiresAt = new Date()

        expiresAt.setDate(
            expiresAt.getDate() + 7
        )

        const session = await this.sessionRepository.create(
            user.id,
            expiresAt,
        )

        const refreshToken = jwt.sign(
            {
                userId: user.id,
                sessionId:session.id
            },
            env.JWT_REFRESH_SECRET,
            {expiresIn:"7d"}
        )

        return{
            user: userWithoutPassword,
            accessToken,
            refreshToken
        }
    }

    async refresh(refreshToken: string) {
        let payload: RefreshTokenPayload;

        try {
            const decoded = jwt.verify(
            refreshToken,
            env.JWT_REFRESH_SECRET
            );

            if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            typeof decoded.sessionId !== "string"
            ) {
            throw new AppError(
                401,
                "Refresh token inválido"
            );
            }

            payload = {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            };
        } catch {
            throw new AppError(
            401,
            "Refresh token inválido o expirado"
            );
        }

        const session =
            await this.sessionRepository.findById(
            payload.sessionId
            );

        if (!session) {
            throw new AppError(401, "Sesión inválida");
        }

        if (session.userId !== payload.userId) {
            throw new AppError(401, "Sesión inválida");
        }

        if (session.revokedAt) {
            throw new AppError(401, "Sesión revocada");
        }

        if (session.expiresAt <= new Date()) {
            throw new AppError(401, "Sesión expirada");
        }

        const accessToken = jwt.sign(
            {
            userId: payload.userId,
            },
            env.JWT_ACCESS_SECRET,
            {
            expiresIn: "15m",
            }
        );

        return {
            accessToken,
        };
    }

    async logout(refreshToken:string){

        let payload: RefreshTokenPayload;

        try{
            const decoded = jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET
            );
            if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            typeof decoded.sessionId !== "string"
            ) {
            throw new AppError(
                401,
                "Refresh token inválido"
            );
            }
            payload = {userId : decoded.userId, sessionId : decoded.sessionId}

        }catch{
            throw new AppError(401,"Refresh token inválido o expirado")
        }

        await this.sessionRepository.revoke(payload.sessionId)
    }
}