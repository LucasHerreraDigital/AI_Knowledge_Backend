import { Request ,  Response, NextFunction } from "express"
import { AppError } from "../../../shared/errors/AppError.js"
import { WorkspaceService } from "../../workspaces/services/workspace.service.js"
import { asyncHandler } from "../../../shared/utils/asyncHandler.js"

const workspaceService = new WorkspaceService()

const workspaceOwnershipValidate = asyncHandler(async(req:Request,res:Response,next:NextFunction) =>{
    if(!req.user){
        throw new AppError(401,"No Autenticado")
    }
    const userId = req.user.id
    const {workspaceId} = req.params as {workspaceId:string}

    await workspaceService.getWorkspaceById(workspaceId,userId)

    next()
})
export {workspaceOwnershipValidate}