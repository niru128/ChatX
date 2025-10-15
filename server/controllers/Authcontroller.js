import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { response } from "express";
import {renameSync,unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
	return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
}

export const signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send("Please enter an email and password");
		}

		const user = await User.create({ email, password });

		res.cookie("jwt", createToken(email, user.id, {
			maxAge,
			httpOnly: true,
			secure: true,
			sameSite: "None",
		}))

		return res.status(201).json({
			user: {
				id: user.id,
				email: user.email,

				profileSetup: false,
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send("Please enter an email and password");
		}

		const user = await User.findOne({ email });

		

		if (!user) {
			return res.status(400).send("Email not found");
		}

		const isMatch = await compare(password, user.password);
		

		if (!isMatch) {
			return res.status(400).send("Invalid password");
		}

		res.cookie("jwt", createToken(email, user.id, {
			maxAge,
			secure: true,
			sameSite: "None",
		}))

		return res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				profileSetup: user.profileSetup,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.image,
				color: user.color,
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}


export const  getUserInfo = async(req,res,next)=>{
	try {
	   const userData = await User.findById(req.userId);

	   if(!userData){
		return res.status(404).send("User not found with the given ID");
	   }


		return res.status(200).json({
			
				id: userData.id,
				email: userData.email,
				profileSetup: userData.profileSetup,
				firstName: userData.firstName,
				lastName: userData.lastName,
				image: userData.image,
				color: userData.color,
					});
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}

export const  updateProfile = async(req,res,next)=>{
	try {
	   const {userId} = req;
	   const {firstName,lastName,color} = req.body;

	   if(!firstName || !lastName){
		req.status(400).send("Firstname, lastname and color is required");

	   }

	   const userData = await User.findByIdAndUpdate(userId,{
		firstName,
		lastName,
		color,
		profileSetup:true

	   },{new:true,runValidators:true})


		return res.status(200).json({
			
				id: userData.id,
				email: userData.email,
				profileSetup: userData.profileSetup,
				firstName: userData.firstName,
				lastName: userData.lastName,
				image: userData.image,
				color: userData.color,
					});
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}


export const  addProfileImage = async(req,res,next)=>{
	try {
	   
		if(!req.file){
			return res.status(400).send("Image not found")
		}

		const date = Date.now();
		let fileName = "uploads/profiles" + date + req.file.originalname;
		renameSync(req.file.path , fileName)

		const updatedUser = await User.findByIdAndUpdate(req.userId,{image : fileName},{new : true, runValidators : true})

		return res.status(200).json({
			
			   
				image: updatedUser.image,
			  
					});
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}


export const  removeProfileImage = async(req,res,next)=>{
	try {
	   const {userId} = req;
	   const user =await User.findById(userId);

	   if(!user){
		return res.status(400).send("User not found")
	   }

	   if(user.image){
		unlinkSync(user.image);
	   }

	   user.image = null;
	   await user.save();

	   


		return res.status(200).send("profile image removed successfully")
	} catch (error) {
		console.log({error});
		res.status(500).send("Internal server error");
	}
}



export const  logOut = async(req,res,next)=>{
	try {
	  
		res.cookie("jwt","",{maxAge : 1,secure:true,sameSite:"None"})
		return res.status(200).send("Log Out successfully")
	} catch (error) {
		console.log({error});
		res.status(500).send("Internal server error");
	}
}


