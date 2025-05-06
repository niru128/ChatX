import User from "../models/UserModel.js";
import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";

export const  createChannel = async(req,res,next)=>{
    try {
      const {name , members} = req.body;

      console.log(name);

      const userId = req.userId;

      const admin = await User.findById(userId);

      if(!admin){
        return res.status(400).send("Admin User not found");
      }

      const validMembers = await User.find({_id:{$in:members}});

      if(validMembers.length !== members.length){
        return res.status(400).send("Invalid members");
      }


      const newChannel = new Channel({
        name,
        members,
        admin : userId
      })

      console.log(newChannel)

      await newChannel.save();  
      return res.status(201).json({channel : newChannel});


    } catch (error) {
        console.log({error});
        res.status(500).send("Internal server error");
    }
}


export const  getUserChannels = async(req,res,next)=>{
    try {
      
      const userId = new mongoose.Types.ObjectId(req.userId);

      const channels = await Channel.find({
        $or : [
            {admin : userId},
            {members : userId}
        ]
      }).sort({updatedAt : -1});
      
      return res.status(201).json({channels})


    } catch (error) {
        console.log({error});
        res.status(500).send("Internal server error");
    }
}

export const  getChannelMessages = async(req,res,next)=>{
  try {
    const {channelId} = req.params;

    const channel = await Channel.findById(channelId).populate({path:"messages",populate:{
      path : 'sender',select : "firstName lastName email _id image color",
    }});

    if(!channel){
      return response.status(404).send("Channel not found")
    }

    const messages = channel.messages
    
    return res.status(201).json({messages})


  } catch (error) {
      console.log({error});
      res.status(500).send("Internal server error");
  }
}