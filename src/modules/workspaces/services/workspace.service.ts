import { AppError } from "../../../shared/errors/AppError.js";
import { WorkspaceRepository } from "../repositories/workspace.repository.js";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "../schemas/workspace.schema.js";

export class WorkspaceService{
    private readonly repository = new WorkspaceRepository()

    async getWorkspaces(){
        return this.repository.findAll()
        
    }

    async getWorkspaceByUser(userId:string){
        return this.repository.findAllByUser(userId)
    }

    async getWorkspaceById(id:string){
        const workspace = await this.repository.findById(id)
        if(!workspace){
            throw new AppError(404,"Workspace no encontrado")
        }
        return workspace
    }

    async createWorkspace(data:CreateWorkspaceDTO){
        const workspace = await this.repository.findByUserAndName(
            data.name,
            data.userId
        )
        if(workspace){
            throw new AppError(409, "Ya existe un workspace con ese nombre")
        }
        
        return this.repository.create(data)
    }

    async updateWorkspace(id:string,data:UpdateWorkspaceDTO){
        const workspace = await this.repository.findById(id)
        if(!workspace){
            throw new AppError(404,"Workspace no encontrado")
        }
        return this.repository.update(id,data)
    }

    async deleteWorkspace(id:string){
        const workspace = await this.repository.findById(id)
        if(!workspace){
            throw new AppError (404,"Workspace no encontrado")
        }
        return this.repository.delete(id)
    }

}