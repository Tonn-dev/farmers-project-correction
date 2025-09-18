//users can update their password and email or even delete their account
import { User } from '../models/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {Request,Response} from 'express';

//update email only if verification is done

export const requestEmailChange = async (userId: number, newEmail: string,currentPassword:string) => {
const user = await User.findByPk(userId);
if (!user) {
  throw new Error('User not found');
}
const isPasswordMatch = await bcrypt.compare(currentPassword , (user as any).password);
if (!isPasswordMatch) {
    throw new Error('Current password is incorrect');
}
//save pending email to the user record
(user as any).pendingEmail = newEmail;
await user.save();
// Create a verification token
const token = jwt.sign({ userId, newEmail }, process.env.JWT_SECRET! as string, { expiresIn: '1h' });

const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;
// Send verification email
const transporter=nodemailer.createTransport({ /*SMTP config */})
await transporter.sendMail({
    from:'"Your App" <no-reply@yourapp.com>',
    to:newEmail,
    subject:'Email Change Verification',
    text:`Click the link to verify your new email: ${verificationLink}`,
});

return true;
}
//when user clicks the link in email
export const verifyEmailChange = async (req:Request,res:Response) => {
    try{
        const {token}=req.query;
        if(!token) return res.status(400).json({message:"Token is required"});
        //decode token
        const payload=jwt.verify(token as string,process.env.JWT_SECRET as string) as {userId:number,newEmail:string};
        const user=await User.findByPk(payload.userId);
        if(!user) return res.status(404).json({message:"User not found"});
        //now we safely apply the pending email
        if((user as any).pendingEmail !== payload.newEmail){
            return res.status(400).json({message:"Email mismatch"});
        }
        (user as any).email=payload.newEmail;
        (user as any).pendingEmail=null;
        await user.save();

        res.status(200).json({message:"Email updated successfully"});
    }catch(error){
        console.error('Error verifying email change:', error);
        if(error instanceof jwt.TokenExpiredError){
            return res.status(400).json({message:"Token expired"});
        }else if(error instanceof jwt.JsonWebTokenError){
            return res.status(400).json({message:"Invalid token"});
        }
        res.status(500).json({message:"Internal Server Error"});
    }
}
//update password
export const updatePassword=async(userId:number,currentPassword:string,newPassword:string)=>{
    const user=await User.findByPk(userId);
    if(!user){
        throw new Error('User not found');
    }
    //verify current password
    const isPasswordMatch=await bcrypt.compare(currentPassword,(user as any).password);
    if(!isPasswordMatch){
        throw new Error('Current password is incorrect');
    }//hash new password and save
    const salt=await bcrypt.genSalt(10);
    const hashedNewPassword=await bcrypt.hash(newPassword,10);
    (user as any).password=hashedNewPassword;
    await user.save();
    return {message:'Password updated successfully'};
}