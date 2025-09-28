import {Profile} from '../models/models';
import { Request, Response } from 'express';


//Function to create profile

export const createProfile = async (req: Request, res: Response) => {
    try {
        //taking userId from Jwt middleware, not body
        const userId= (req as any).user?.id; // Assuming the token payload contains the user ID
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorize: missing user Id' });
        }
        console.log('User ID from middleware:', userId); // Debug log

        const { type, address, contact,farm_name,latitude,longitude} = req.body;
        if (!req.body.userId || !req.body.address || !req.body.contact) {
            return res.status(400).json({ error: 'userId, address, and contact are required' });
        }

        // Check if profile already exists for the user
        const existingProfile = await Profile.findOne({ where: { user_id:userId } });
        if (existingProfile) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }
        
        const newProfile = await Profile.create({ user_id:userId,type, address, contact,farm_name,latitude,longitude });
        res.status(201).json({ message: 'Profile created successfully', profileId: newProfile.get('profile_id') });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Internal Server Error while creating profile' });
    }
};
export const getProfileByUserId = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id; // Assuming the token payload contains the user ID
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorize: missing user Id' });
        }
        console.log('User ID from middleware:', userId); // Debug log

        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found for this user' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching profile' });
    }
};

// Function to update profile by userId
export const updateProfileByUserId = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id; // Assuming the token payload contains the user ID
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorize: missing user Id' });
        }
        console.log('User ID from middleware:', userId); // Debug log

        const { type, address, contact,farm_name,latitude,longitude} = req.body;

        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found for this user' });
        }

        await profile.update({ type, address, contact,farm_name,latitude,longitude});
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error while updating profile' });
    }
};

// Function to delete profile by userId
export const deleteProfileByUserId = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id; // Assuming the token payload contains the user ID
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorize: missing user Id' });
        }
        console.log('User ID from middleware:', userId); // Debug log

        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found for this user' });
        }

        await profile.destroy();
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Internal Server Error while deleting profile' });
    }
};      
// Function to get all profiles (for admin/officer use)
export const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.findAll();
        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching profiles' });
    }
};
// Function to get a profile by profile ID (for admin/officer use)
export const getProfileById = async (req: Request, res: Response) => {
    try {
        const profileId = req.params.id;
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching profile' });
    }
};
