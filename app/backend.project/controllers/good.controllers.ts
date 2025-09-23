import {Request, Response} from "express";
import { Good,Inspect } from '../models/models';
import { Op } from 'sequelize';
// Function to create a new good
export const createGood = async (req: Request, res: Response) => {
    try {
        const { name, description, price, quantity, profile_id } = req.body;
        if (!name || !price || !quantity || !profile_id) {
            return res.status(400).json({ error: 'Name, price, quantity, and profile_id are required' });
        }

        const newGood = await Good.create({ name, description, price, quantity, profile_id });
        res.status(201).json({ message: 'Good created successfully', goodId: newGood.get('good_id') });
    } catch (error) {
        console.error('Error creating good:', error);
        res.status(500).json({ error: 'Internal Server Error while creating good' });
    }
};

// Function to get all goods
export const getAllGoods = async (req: Request, res: Response) => {
    try {
        let goods;
        if ((req as any).user?.role  === "farmer") {
      // farmer only sees their own goods
      goods = await Good.findAll({ where: { farmerId: (req as any).user?.id } });
    } else if((req as any).user?.role  === "customer") {
      // customer only sees available goods where inspection passed and quantity is great than 0

      goods = await Good.findAll({
          where:{quantity: {[Op.gt]:0}},
         include: [
          {
            model: Inspect,
            where: { status: "passed" },
          },
        ],});
    }    
    
    else {
      // admin & officer see all goods
      goods = await Good.findAll();
    }
        
        res.status(200).json(goods);
    } catch (error) {
        console.error('Error fetching goods:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching goods' });
    }
};

// Function to get a good by ID
export const getGoodById = async (req: Request, res: Response) => {
    try {
        const goodId = req.params.id;
        const good = await Good.findByPk(goodId);
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }
        res.status(200).json(good);
    } catch (error) {
        console.error('Error fetching good:', error);
        res.status(500).json({ error: 'Internal Server Error while fetching good' });
    }
};

// Function to update a good by ID
export const updateGood = async (req: Request, res: Response) => {
    try {
        const goodId = req.params.id;
        const { name, description, price, quantity } = req.body;

        const good = await Good.findByPk(goodId);
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        await good.update({ name, description, price, quantity });
        res.status(200).json({ message: 'Good updated successfully' });
    } catch (error) {
        console.error('Error updating good:', error);
        res.status(500).json({ error: 'Internal Server Error while updating good' });
    }
};

// Function to delete a good by ID
export const deleteGood = async (req: Request, res: Response) => {
    try {
        const goodId = req.params.id;

        const good = await Good.findByPk(goodId);
        if (!good) {
            return res.status(404).json({ error: 'Good not found' });
        }

        await good.destroy();
        res.status(200).json({ message: 'Good deleted successfully' });
    } catch (error) {
        console.error('Error deleting good:', error);
        res.status(500).json({ error: 'Internal Server Error while deleting good' });
    }
};  
