import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from '../models/models'; // Adjust the import path as necessary 
import{ Role } from '../models/models'; // Adjust the import path as necessary


export const register = async (req: Request, res: Response) => {
    try {
        console.log('Register request body:', req.body); // <== log incoming data
        if (!req.body.email || !req.body.password || !req.body.role_id) {
            return res.status(400).json({ error: 'Email, password, and role_id are required' });
        }

        const { email, password, role_id } = req.body as { email: string; password: string; role_id: number };
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role_id });
        res.status(201).json({ message: 'User registered successfully', userId: newUser.get('user_id') });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error while Registering' });
    }
}
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    try {
        const user = await User.findOne({ where: { email } , include: [{ model: Role }] });
        if(!user||!(await bcrypt.compare(password, (user as any).password))) {
            return res.status(404).json({ error: 'User not found' });
        }
        const token = jwt.sign({ userId: (user as any).user_id, role: (user as any).role_name }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        //return token in response
        res.status(200).json({ message: 'Login successful', token, userId: (user as any).user_id, role: (user as any).Role.role_name });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal Server Error while login' });
    }
}
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error while getting users' });
    }
}