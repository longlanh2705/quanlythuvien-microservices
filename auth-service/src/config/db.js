import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const postgresUri = process.env.POSTGRES_URI || 'postgres://postgres:adminpassword@localhost:5433/library_db';

export const sequelize = new Sequelize(postgresUri, {
  dialect: 'postgres',
  logging: false, // Tắt log SQL để terminal gọn gàng
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: library_db');
    // Tự động đồng bộ bảng khi có thay đổi model
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Lỗi kết nối PostgreSQL:', error.message);
    process.exit(1);
  }
};
