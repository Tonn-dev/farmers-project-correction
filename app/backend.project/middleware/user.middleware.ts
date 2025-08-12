import { NextFunction, Request,Response } from 'express';
import jwt from 'jsonwebtoken';

function authenticate(req:Request,res:Response,next:NextFunction){
    const token=req.headers.authorization?.split(" ")[1];
    if(!token)return res.status(403).json({message:"Token Required"})

        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET as string);
            (req as any).user=decoded;
            next();
        }catch(error){
            console.error('Authentication error:', error);
            return res.status(401).json({message:"Invalid Token"});
        }
}
function authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

export { authenticate, authorize };