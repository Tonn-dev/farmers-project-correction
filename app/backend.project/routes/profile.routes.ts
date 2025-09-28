import { createProfile } from "../controllers/profile.controllers";
import { getProfileByUserId } from "../controllers/profile.controllers";
import { updateProfileByUserId } from "../controllers/profile.controllers";
import { getAllProfiles } from "../controllers/profile.controllers";
import { getProfileById } from "../controllers/profile.controllers";
import { deleteProfileByUserId } from "../controllers/profile.controllers";
import express from "express";
import { authenticate } from "../middleware/user.middleware";
//router instance
const router=express.Router();

//Route to create profile
//protected route, only authenticated users can create profile
router.post('/createProfile' ,authenticate,createProfile);
router.get('/getProfileByUserId',authenticate,getProfileByUserId);
router.put('/updateProfileByUserId',authenticate,updateProfileByUserId);
router.get('/getAllProfiles',authenticate,getAllProfiles);
router.get('/getProfileById/:id',authenticate,getProfileById);
router.delete('/deleteProfileByUserId',authenticate,deleteProfileByUserId);


//Export the router to be used in the main app
export default router;
