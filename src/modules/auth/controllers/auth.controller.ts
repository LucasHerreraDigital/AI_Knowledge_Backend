import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController{
    private readonly service = new AuthService()

    registerUser = asyncHandler(async (req,res)=>{
        const user = await this.service.register(req.body)
        return res.status(201).json(user)
    })

    loginUser = asyncHandler(async(req,res)=>{
        const user = await this.service.login(req.body)
        return res.status(200).json(user)
    })
}