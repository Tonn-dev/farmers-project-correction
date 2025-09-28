//export Sequelize instance
import { Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
// Ensure you have the correct path to your .env file
// Use your actual MySQL database name here
const sequelize = new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: 'postgres',
});

sequelize.authenticate()
.then(() => {
  console.log('Connection to the database has been established successfully.👏');
})
.catch(() => {
  console.log('Unable to connect to the database:💔');
});

export default sequelize;