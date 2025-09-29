import express from 'express';
import { register, login, getAllUsers } from '../controllers/user.controllers';
import { authenticate, authorize } from '../middleware/user.middleware';
import { requestEmailChange,verifyEmailChange } from '../services/user.services';
import { updatePassword } from '../services/user.services';
import { logout } from '../controllers/user.controllers';
const router=express.Router();

// User registration route
router.post('/register', register);
// User login route
router.post('/login', login);
//AUTHENTICATION AND AUTHORIZATION routes
router.get('/getUsers', authenticate, authorize(['admin']), getAllUsers);
// Route to request email change
router .post('/request-email-change', async (req, res) => {
    const {userId,currentPassword,newEmail} = req.body; // Assuming the request body contains the user ID,currentPassword,newEmail  

    try {
        await requestEmailChange(userId, currentPassword,newEmail,);
        res.status(200).json({ message: 'Verification email sent to new address' });
    } catch (error) {
        console.error('Error requesting email change:', error);
        res.status(500).json({ message: 'Internal Server Error while requesting for email change' });
    }
});
// Route to verify email change
router.get('/verify-email', verifyEmailChange);
// Route to update password
router.post('/update-password',async(req,res)=>{
    const {currentPassword,newPassword}=req.body;
    try{
        //using the id from token payload not the client's request body
        const userId=(req as any).user.id;
        await updatePassword(userId,currentPassword,newPassword);
        res.status(200).json({message:"Password updated successfully"});
    }catch(error){
        console.error('Error updating password:', error);
        res.status(500).json({message:"Internal Server Error"});
    }
})
// Route to log out user
router.post('/logout', authenticate,logout);
// Export the router to be used in the main app
export default router;
     