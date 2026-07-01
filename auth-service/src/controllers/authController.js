import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp username và password' });
    }

    const result = await authService.login(username, password);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { studentId, fullName } = req.body;
    if (!studentId || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã sinh viên và họ tên' });
    }

    const result = await authService.createStudentAccount(studentId, fullName);
    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản sinh viên thành công',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ username, password và fullName' });
    }

    const result = await authService.registerAccount(username, password, fullName);
    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
