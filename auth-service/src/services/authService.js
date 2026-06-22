import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sequelize } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_library_key_123';

export const seedAdmin = async () => {
  try {
    // Sync DB structure first
    await sequelize.sync({ force: false });

    // Check if admin exists
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.log('Không tìm thấy tài khoản admin, đang tiến hành tạo tự động...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        fullName: 'Quản Trị Viên Hệ Thống',
      });
      console.log('Đã tạo tài khoản admin thành công (admin / admin123)');
    } else {
      console.log('Tài khoản admin đã tồn tại. Bỏ qua bước seed.');
    }
  } catch (error) {
    console.error('Lỗi khi seed tài khoản admin:', error.message);
  }
};

export const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    }
  };
};

export const createStudentAccount = async (studentId, fullName) => {
  // Logic kiểm tra trùng mã SV
  const exists = await User.findOne({ where: { username: studentId } });
  if (exists) {
    throw new Error(`Sinh viên với mã ${studentId} đã có tài khoản`);
  }

  // Mật khẩu mặc định là mã sinh viên
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(studentId, salt);

  const newUser = await User.create({
    username: studentId,
    password: hashedPassword,
    role: 'STUDENT',
    fullName: fullName,
  });

  return {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    fullName: newUser.fullName,
  };
};
