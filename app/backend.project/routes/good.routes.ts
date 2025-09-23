import{createGood,getAllGoods,getGoodById} from '../controllers/good.controllers';
import express from 'express';
import { authenticate,authorize } from '../middleware/user.middleware';
const router=express.Router();
// routes to get all goods and get a good by ID
router.post('/createGood',authenticate,authorize(["farmer"]),createGood);
router.get('/getAllGoods',authenticate,getAllGoods);
router.get('/getGoodById/:id',authenticate,authorize(["admin","officer","farmer"]),getGoodById);
// Export the router to be used in the main app
export default router;