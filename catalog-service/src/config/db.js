import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/catalog_db?authSource=admin';
    console.log(`Đang kết nối tới MongoDB: ${connStr.replace(/:([^:@]+)@/, ':***@')}`); // Che password khi log
    
    const conn = await mongoose.connect(connStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1);
  }
};
