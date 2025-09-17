import {Profile} from '../models/models';
import { Request, Response } from 'express';


//Function to create profile

export const createProfile = async (req: Request, res: Response) => {
    try {
        //secure : take user_id from the token payload instead of request body

        const user_id= (req as any) .user.id; // Assuming the token payload contains the user ID
        const { name, address, contact,farm_name,latitude,longitude} = req.body;
        
        // Check if profile already exists for the user
        const existingProfile = await Profile.findOne({ where: { user_id } });
        if (existingProfile) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }
        
        const newProfile = await Profile.create({ user_id:user_id, name, address, contact,farm_name,latitude,longitude });
        res.status(201).json({ message: 'Profile created successfully', profileId: newProfile.get('profile_id') });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Internal Server Error while creating profile' });
    }
};

