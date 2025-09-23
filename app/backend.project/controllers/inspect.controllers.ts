import {Inspect} from '../models/models';
import { Request, Response } from 'express';
// Function to create a new inspection record
export const createInspect = async (req: Request, res: Response) => {
    try {
        const { profile_id,inspect_id, good_id, inspector_name, inspection_date, status, comments } = req.body;
        if (!profile_id || !good_id || !inspector_name || !inspection_date || !status || !comments || !inspect_id ) {
            return res.status(400).json({ error: 'profile_id, good_id, inspector_name, inspection_date, and result are required' });
        }

        const newInspect = await Inspect.create({ profile_id, good_id, inspector_name, inspection_date, status, comments,inspect_id });
        res.status(201).json({ message: 'Inspection record created successfully', inspectId: newInspect.get('inspect_id') });
    } catch (error) {
        console.error('Error creating inspection record:', error);
        res.status(500).json({ error: 'Internal Server Error while creating inspection record' });
    }
};

// Function to get all inspection records
export const getAllInspects = async (req: Request, res: Response) => {
    try {
        const inspects = await Inspect.findAll();
        res.status(200).json(inspects);
    } catch (error) {
        console.error('Error fetching inspection records:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching inspection records' });
    }
};

// Function to get an inspection record by ID
export const getInspectById = async (req: Request, res: Response) => {
    try {
        const inspectId = req.params.id;
        const inspect = await Inspect.findByPk(inspectId);
        if (!inspect) {
            return res.status(404).json({ error: 'Inspection record not found' });
        }
        res.status(200).json(inspect);
    } catch (error) {
        console.error('Error fetching inspection record:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching inspection record' });
    }
};

// Function to update an inspection record by ID
export const updateInspect = async (req: Request, res: Response) => {
    try {
        const inspectId = req.params.id;
        const { profile_id, good_id, inspector_name, inspection_date, result, remarks } = req.body;

        const inspect = await Inspect.findByPk(inspectId);
        if (!inspect) {
            return res.status(404).json({ error: 'Inspection record not found' });
        }

        await inspect.update({ profile_id, good_id, inspector_name, inspection_date, result, remarks });
        res.status(200).json({ message: 'Inspection record updated successfully' });
    } catch (error) {
        console.error('Error updating inspection record:', error);
        res.status(500).json({ error: 'Internal Server Error while updating inspection record' });      
    }
};
// Function to delete an inspection record by ID
export const deleteInspect = async (req: Request, res: Response) => {
    try {
        const inspectId = req.params.id;
        const inspect = await Inspect.findByPk(inspectId);
        if (!inspect) {
            return res.status(404).json({ error: 'Inspection record not found' });
        }

        await inspect.destroy();
        res.status(200).json({ message: 'Inspection record deleted successfully' });
    } catch (error) {
        console.error('Error deleting inspection record:', error);
        res.status(500).json({ error: 'Internal Server Error while deleting inspection record' });
    }
};  
// Function to get all inspection records for a specific profile
export const getInspectsByProfileId = async (req: Request, res: Response) => {
    try {
        const profileId = req.params.profile_id;
        const inspects = await Inspect.findAll({ where: { profile_id: profileId } });
        res.status(200).json(inspects);
    } catch (error) {
        console.error('Error fetching inspection records for profile:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching inspection records for profile' });
    }
};

