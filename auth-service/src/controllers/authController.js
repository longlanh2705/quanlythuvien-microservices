import * as authService from '../services/authService.js';
import { validateUsername, validatePassword, validateFullName } from '../utils/validators.js';

// ─── Đăng ký ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // 1. Kiểm tra trường rỗng
    if (!username || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ: Tên đăng nhập, Mật khẩu và Họ tên.',
      });
    }

    // 2. Validate từng trường theo quy tắc
    const usernameErr = validateUsername(username);
    if (usernameErr) return res.status(400).json({ success: false, message: usernameErr });

    const passwordErr = validatePassword(password);
    if (passwordErr) return res.status(400).json({ success: false, message: passwordErr });

    const fullNameErr = validateFullName(fullName);
    if (fullNameErr) return res.status(400).json({ success: false, message: fullNameErr });

    const result = await authService.registerAccount(
      username.trim(),
      password,
      fullName.trim()
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Đăng nhập ───────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tài khoản và mật khẩu.',
      });
    }

    // Giới hạn độ dài để tránh tấn công chuỗi quá dài
    if (String(username).length > 100 || String(password).length > 256) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không hợp lệ.',
      });
    }

    const result = await authService.login(username.trim(), password);
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: result,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// ─── Lấy hồ sơ ───────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng',
    });
  }
};

// ─── Cập nhật hồ sơ ──────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { fullName } = req.body;

    // Validate fullName đầy đủ
    const fullNameErr = validateFullName(fullName);
    if (fullNameErr) return res.status(400).json({ success: false, message: fullNameErr });

    const result = await authService.updateUserProfile(userId, { fullName: fullName.trim() });

    res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};