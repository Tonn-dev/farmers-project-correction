import { createProfile } from "../controllers/profile.controllers";
import express from "express";

//router instance
const router=express.Router();

//Route to create profile
router.post('/createProfile',createProfile);
//Export the router to be used in the main app
export default router;
