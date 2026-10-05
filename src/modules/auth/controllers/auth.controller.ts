import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class AuthController{
    private readonly service = new AuthService()

    registerUser = asyncHandler(async (req,res)=>{
        const user = await this.service.register(req.body)
        return res.status(201).json(user)
    })

    loginUser = asyncHandler(async(req,res)=>{
        const{user,accessToken,refreshToken} = await this.service.login(req.body)
        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        });

        return res.status(200).json({user,accessToken})

    })
    
    refresh = asyncHandler(async(req,res)=>{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            throw new AppError(401,"Refresh token requerido")
        }

        const {accessToken} = await this.service.refresh(refreshToken)
        return res.status(200).json({accessToken})
    })

    logout = asyncHandler(async(req,res)=>{
         
    })
}