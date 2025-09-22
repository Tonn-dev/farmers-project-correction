import express from 'express';
import dotenv from "dotenv"
import sequelize from "../models/index"// import sequelize instance
dotenv.config();
import userRouter from '../routes/user.routes'; // Adjust the import path as necessary
import profileRouter from '../routes/profile.routes';
// Use profile routes

import { Role } from '../models/models';



const app = express();
const port=process.env.PORT  ||3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRouter);
app.use('/api/profile',  profileRouter);
app.use((req, res) => {
  res.status(404).json({ error:`message:${req.method} ${req.originalUrl}` });
});

//connect to the database and sync models
sequelize.sync({ alter: true })
  .then(async() => {
    console.log('Database & tables created!');
    await Role.bulkCreate([
    { role_id: 1, role_name: 'admin' },
    { role_id: 2, role_name: 'officer' },
    { role_id: 3, role_name: 'farmer' },
    { role_id: 4, role_name: 'customer' },

  ], {
    ignoreDuplicates: true
  });
  })
  .catch((error: Error) => {
    console.error('Error creating database or tables:', error);
  })


// server listening
app.listen(port, () => {
    console.log(`🚀 Server running on ${port}`);
}); 
