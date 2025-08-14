// File: app/backend.project/models/models.ts
import dotenv from 'dotenv';
// dotenv.config({ path: __dirname + '/../../.env' }); // ✅ Adjust based on your folder depth

dotenv.config();
import { Sequelize,DataTypes,Op } from 'sequelize';
// Ensure you have the correct path to your .env file


// File: project/models.ts
// --- a/file:///c%3A/Users/user/Desktop/myProject_sequelize/project/models.ts


// Use your actual MySQL database name here
const sequelize = new Sequelize(

{
    database:process.env.DB_NAME! ,
    username:process.env.DB_USER !,
    password:process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!), 
    dialect: 'postgres',
  }
);


sequelize.authenticate()
.then(() => {
  console.log('Connection to the database has been established successfully.👏');
})
.catch(() => {
  console.log('Unable to connect to the database:💔');
});

// DataTypes is now imported directly from sequelize above
// 1. Role model
const Role = sequelize.define('Role', {
  role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role_name: { type: DataTypes.STRING(50), unique: true, allowNull: false }
}, { timestamps: false ,
freezeTableName: true} // This will prevent Sequelize from pluralizing table names

);
// 2. User model
const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Role, key: 'role_id' }
  }
},{ timestamps: false ,
freezeTableName: true} // This will prevent Sequelize from pluralizing table names
);
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// 3. Profile-Polymorphism model

const Profile = sequelize.define('Profile', {
  profile_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' }, allowNull: false },
  type: { // 'customer', 'farmer', 'admin', 'officer'
    type: DataTypes.ENUM('customer', 'farmer', 'admin', 'officer'),
    allowNull: false
  },
  region: DataTypes.STRING,
  location: DataTypes.STRING,
  contact: DataTypes.STRING,
  farm_name: DataTypes.STRING ,// only for farmers (nullable)
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true }
},
{
 timestamps: false ,
freezeTableName: true} // This will prevent Sequelize from pluralizing table names
);

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

// 4. Goods model
const Good = sequelize.define('Good', {
  good_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  farmer_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: Profile, key: 'profile_id' },
    allowNull: false
  },
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  status: DataTypes.ENUM('available', 'sold_out', 'pending', 'discontinued'),
  price: DataTypes.DECIMAL(7, 2),
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true }
});

Profile.hasMany(Good, { foreignKey: 'farmer_profile_id' });
Good.belongsTo(Profile, { foreignKey: 'farmer_profile_id' });

//Inspect Good model
const Inspect=sequelize.define('Inspect', {
  inspect_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  good_id: {  type: DataTypes.INTEGER, references: { model: Good, key: 'good_id' }, allowNull: false },
  inspection_date: { type: DataTypes.DATE, allowNull: false },
  Profile_id: { type: DataTypes.INTEGER, references: { model: Profile, key: 'profile_id' }, allowNull: false },
  status: { type: DataTypes.ENUM('passed', 'failed'), allowNull: false },
  comments: { type: DataTypes.STRING(500), allowNull: true }},
  {timestamps:true}
);

Good.hasMany(Inspect, { foreignKey: 'good_id' });
Inspect.belongsTo(Good, { foreignKey: 'good_id' });
// 5. Cart model
const Cart = sequelize.define('Cart', {
  cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: Profile, key: 'profile_id' }
  }
});

Profile.hasMany(Cart, { foreignKey: 'customer_profile_id' });
Cart.belongsTo(Profile, { foreignKey: 'customer_profile_id' });

// 6. Purchase model
const Purchase = sequelize.define('Purchase', {
  purchase_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_profile_id: {
    type: DataTypes.INTEGER,
    references: { model: Profile, key: 'profile_id' }
  },
  good_id: {
    type: DataTypes.INTEGER,
    references: { model: Good, key: 'good_id' }
  }
});

Profile.hasMany(Purchase, { foreignKey: 'customer_profile_id' });
Good.hasMany(Purchase, { foreignKey: 'good_id' });
Purchase.belongsTo(Profile, { foreignKey: 'customer_profile_id' });
Purchase.belongsTo(Good, { foreignKey: 'good_id' });

// 7. CartItem (Many-to-Many: Cart <-> Good) model 
const CartItem = sequelize.define('CartItem', {
  cart_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { type: DataTypes.INTEGER, references: { model: Cart, key: 'cart_id' } },
  good_id: { type: DataTypes.INTEGER, references: { model: Good, key: 'good_id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
});

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
Good.hasMany(CartItem, { foreignKey: 'good_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Good, { foreignKey: 'good_id' });

// 8. Message (Admin to User) model
const Message = sequelize.define("Message", {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin_profile_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Profile,
      key: "profile_id",
    },
    allowNull: false,
  },
  recipient_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id",
    },
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  read_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true
});

Profile.hasMany(Message, { foreignKey: "admin_profile_id" });
User.hasMany(Message, { foreignKey: "recipient_id" });
Message.belongsTo(Profile, { foreignKey: "admin_profile_id" });
Message.belongsTo(User, { foreignKey: "recipient_id" });

// EXPORT MODELS
export {
  Role,
  User,
  Profile,
  Good,
  Inspect,
  Cart,
  CartItem,
  Purchase,
  Message
};
// Sync the model with the database
User.sync({ alter: true }) // This will update the table structure if it has changed
Role.sync({ alter: true })

