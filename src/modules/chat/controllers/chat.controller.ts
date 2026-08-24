import { ChatService } from "../services/chat.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export class ChatController {
    private readonly service = new ChatService()

    getChatById = asyncHandler(async(req,res)=>{
        const {id} = req.params as {id:string}
        const chat = await this.service.getChatById(id)
        return res.status(200).json(chat)
    })

    searchChats = asyncHandler(async(req,res)=>{
        const { q } = req.query as {
            q?: string
        }
        const userId = req.user!.id
        if(!q?.trim()){
            return res.status(200).json([])
        }
        const chats = await this.service.searchChats(q.trim(),userId)
        return res.status(200).json(chats)
    })

    getChatByIdWithWorkspace = asyncHandler(async(req,res)=>{
        const {id} = req.params as {id:string}
        const chat = await this.service.getChatByIdWithWorkspace(id)
        return res.status(200).json(chat)
    })

    getChatsByWorkspace = asyncHandler(async(req,res)=>{
        const { workspaceId } = req.params as { workspaceId:string }
        const userId = req.user!.id
        const chats = await this.service.getChatsByWorkspace(workspaceId,userId)
        return res.status(200).json(chats)
    })

    createChat = asyncHandler(async(req,res)=>{
        const userId = req.user!.id
        const chat = await this.service.createChat({
            ...req.body
        },
        userId)
        return res.status(201).json(chat)
    })

    updateChat = asyncHandler(async(req,res)=>{
        const {id} = req.params as {id:string}
        const userId = req.user!.id
        const chat = await this.service.updateChat(id,userId,req.body)
        return res.status(200).json(chat)
    })

    deleteChat = asyncHandler(async(req,res)=>{
        const { id } = req.params as { id: string }
        const userId = req.user!.id
        await this.service.deleteChat(id,userId)
        res.status(204).send()
    })

    createMessage = asyncHandler(async(req,res)=>{
        const { id } = req.params as { id:string }
        const userId = req.user!.id
        const message = await this.service.createMessage(
            {
                chatId:id,
                ...req.body
            },
            userId
        )
        return res.status(201).json(message)
    })

    getMessagesByChat = asyncHandler(async(req,res)=>{
        const { id } = req.params as { id: string }
        const userId = req.user!.id
        const message = await this.service.getMessagesByChat(id,userId)
        return res.status(200).json(message)
    })

}