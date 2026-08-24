import multer from "multer"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

const storage = multer.diskStorage({
    destination(req, file,cb){
        const {workspaceId} = req.body
        const uploadPath = path.join(
            "storage",
            "tenants",
            workspaceId,
            "documents"
        )
        fs.mkdirSync(uploadPath,{
            recursive: true 
        })
        cb(null,uploadPath)
    },
    filename(req,file,cb){
        const extension = path.extname(
            file.originalname
        );
        cb(
            null,
            `${crypto.randomUUID()}${extension}`
        )
    }
})

export const upload = multer({
    storage,
    limits:{
        fieldSize: 10 * 1024 * 1024
    }
})