import { AppError } from "../../../shared/errors/AppError.js";
import { WorkspaceRepository } from "../repositories/workspace.repository.js";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "../schemas/workspace.schema.js";

export class WorkspaceService{
    private readonly repository = new WorkspaceRepository()

    async getWorkspaces(userId:string){
        return this.repository.findAllByUser(userId)
        
    }

    async getWorkspaceById(id:string,userId:string){
        const workspace = await this.repository.findByIdAndUser(id,userId)
        if(!workspace){
            throw new AppError(404,"Workspace no encontrado")
        }
        return workspace
    }

    async createWorkspace(data:CreateWorkspaceDTO,userId:string){
        const workspace = await this.repository.findByUserAndName(
            data.name,
            userId
        )
        if(workspace){
            throw new AppError(409, "Ya existe un workspace con ese nombre")
        }
        
        return this.repository.create(data,userId)
    }

    async updateWorkspace(id:string,data:UpdateWorkspaceDTO,userId:string){
        const workspace = await this.repository.findByIdAndUser(id,userId)
        if(!workspace){
            throw new AppError(404,"Workspace no encontrado")
        }
        return this.repository.update(id,data)
    }

    async deleteWorkspace(id:string,userId:string){
        const workspace = await this.repository.findByIdAndUser(id,userId)
        if(!workspace){
            throw new AppError (404,"Workspace no encontrado")
        }
        return this.repository.delete(id)
    }

}