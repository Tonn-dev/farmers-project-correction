import express from 'express';
import { register, login, getAllUsers } from '../controllers/user.controllers';
import { authenticate, authorize } from '../middleware/user.middleware';

const router=express.Router();

// User registration route
router.post('/register', register);
// User login route
router.post('/login', login);
//AUTHENTICATION AND AUTHORIZATION routes
router.get('/', authenticate, authorize(['admin']), getAllUsers);

// Export the router to be used in the main app
export default router;
     