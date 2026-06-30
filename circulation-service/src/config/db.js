import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Circulation Service] MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Circulation Service] Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

export { connectDB };
