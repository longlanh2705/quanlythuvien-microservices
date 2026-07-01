import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Tắt log SQL query
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Circulation Service] Kết nối PostgreSQL thành công!');
    
    // Auto sync models with database (Cẩn thận trên Production)
    await sequelize.sync({ alter: true });
    console.log('[Circulation Service] Đã đồng bộ Database!');
  } catch (error) {
    console.error('[Circulation Service] Lỗi kết nối PostgreSQL:', error.message);
    process.exit(1);
  }
};

export default sequelize;
