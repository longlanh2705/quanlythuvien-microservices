import express from 'express';
import bcrypt from 'bcryptjs';
import * as authController from '../controllers/authController.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/student', authController.createStudent);

// Thêm API lấy danh sách user
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm API toggle trạng thái (Khóa tài khoản)
router.put('/users/:id/toggle-lock', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.role === 'ADMIN') return res.status(400).json({ success: false, message: 'Cannot lock admin' });

    user.status = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    await user.save();
    
    res.status(200).json({ success: true, message: `Đã đổi trạng thái tài khoản ${user.username} thành ${user.status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm API duyệt tài khoản
router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.status !== 'PENDING') return res.status(400).json({ success: false, message: 'User is not pending' });

    user.status = 'ACTIVE';
    await user.save();
    
    res.status(200).json({ success: true, message: `Đã duyệt tài khoản ${user.username}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm API cập nhật thông tin
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (req.body.fullName) user.fullName = req.body.fullName;
    await user.save();
    
    res.status(200).json({ success: true, message: `Đã cập nhật tài khoản ${user.username}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm API tạo nhân viên
router.post('/users/staff', async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    // Hash pass
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      username,
      password: hashedPassword,
      fullName,
      role: role || 'LIBRARIAN',
      status: 'ACTIVE' // Nhân viên thì active luôn
    });

    res.status(201).json({ success: true, message: 'Tạo tài khoản nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
