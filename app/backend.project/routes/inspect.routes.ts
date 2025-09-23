import {createInspect,getAllInspects,getInspectById} from '../controllers/inspect.controllers';
import express from 'express';
import { authenticate,authorize } from '../middleware/user.middleware';
const router=express.Router();
// routes to get all inspects and get an inspect by ID
router.post('/createInspect',authenticate,authorize(["officer"]),createInspect);
router.get('/getAllInspects',authenticate,authorize(["admin","officer"]),getAllInspects);
router.get('/getInspectById/:id',authenticate,authorize(["admin","officer"]),getInspectById);
// Export the router to be used in the main app
export default router;
