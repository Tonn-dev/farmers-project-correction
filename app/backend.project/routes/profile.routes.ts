import { createProfile } from "../controllers/profile.controllers";
import express from "express";
import { authenticate } from "../middleware/user.middleware";
//router instance
const router=express.Router();

//Route to create profile
//protected route, only authenticated users can create profile
router.post('/createProfile' ,authenticate,createProfile);
//Export the router to be used in the main app
export default router;
