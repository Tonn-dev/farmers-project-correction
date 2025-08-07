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
export default sequelize;