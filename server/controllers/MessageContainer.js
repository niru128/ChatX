import { fileURLToPath } from "url";
import Message from "../models/MessageModel.js";
import {mkdirSync, renameSync} from "fs"

export const  getMessages = async(req,res,next)=>{
    try {
        const user1 = req.userId;
        const user2  = req.body.id;

        console.log("user 1 ",user1)
        console.log("user 2 ",user2)

        if(!user1 || !user2){
            return res.status(400).send("Both users are  required")
        }

        const messages = await Message.find({
           $or : [
               {sender : user1 ,recipient  : user2},
               {sender : user2 ,recipient  : user1}
           ]
        }).sort({ timeStamps: 1 });

        
      
        return res.status(200).json({messages});    
    } catch (error) {
        console.log({error});
        res.status(500).send("Internal server error");
    }
}


export const  uploadFiles = async(req,res,next)=>{
    try {

        if(!req.file){
            res.status(400).send("File is required")
        }

        const date = Date.now();
        const fileDir = `uploads/files/${date}`;
        const fileName = `${fileDir}/${req.file.originalname}`;

        console.log(fileDir)

        mkdirSync(fileDir, { recursive: true })
        renameSync(req.file.path,fileName);
        
        return res.status(200).json({filePath : fileName});    
    } catch (error) {
        console.log({error});
        res.status(500).send("Internal server error");
    }
}