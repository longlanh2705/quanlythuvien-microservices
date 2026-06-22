import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const postgresUri = process.env.POSTGRES_URI || 'postgres://postgres:adminpassword@localhost:5432/library_db';

export const sequelize = new Sequelize(postgresUri, {
  dialect: 'postgres',
  logging: false, // Tắt log SQL để terminal gọn gàng
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: library_db');
  } catch (error) {
    console.error('Lỗi kết nối PostgreSQL:', error.message);
    process.exit(1);
  }
};
