import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_library_key_123';

const signToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

// ─── 1. Seed Admin ────────────────────────────────────────────────────────────
export const seedAdmin = async () => {
  try {
    await User.sync({ alter: true });

    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.log('Không tìm thấy tài khoản admin, đang tiến hành tạo tự động...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
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

// ─── 2. Đăng ký ───────────────────────────────────────────────────────────────
export const registerAccount = async (username, password, fullName) => {
  const cleanUsername = username.trim().toLowerCase();
  const cleanFullName = fullName.trim();

  // Kiểm tra trùng username (không phân biệt hoa/thường)
  const existingUser = await User.findOne({
    where: { username: { [Op.iLike]: cleanUsername } },
  });
  if (existingUser) {
    throw new Error(`Tài khoản '${cleanUsername}' đã tồn tại trong hệ thống!`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: cleanUsername,
    password: hashedPassword,
    role: 'STUDENT',
    fullName: cleanFullName,
  });

  const token = signToken(newUser);
  return {
    token,
    user: { id: newUser.id, username: newUser.username, role: newUser.role, fullName: newUser.fullName },
  };
};

// ─── 3. Đăng nhập ─────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  const cleanUsername = username.trim().toLowerCase();

  // Tìm bất kể hoa/thường để đồng nhất với đăng ký
  const user = await User.findOne({
    where: { username: { [Op.iLike]: cleanUsername } },
  });

  if (!user) {
    // Trả về thông báo chung — không tiết lộ username có tồn tại hay không
    throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
  }

  const token = signToken(user);
  return {
    token,
    user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
  };
};

// ─── 4. Cập nhật hồ sơ ────────────────────────────────────────────────────────
export const updateUserProfile = async (userId, { fullName }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Không tìm thấy người dùng.');

  user.fullName = fullName.trim();
  await user.save();

  const token = signToken(user);
  return {
    token,
    user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
  };
};