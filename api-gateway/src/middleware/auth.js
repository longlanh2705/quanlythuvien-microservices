import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_library_key_123';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'Vui lòng cung cấp token' });
  }

  try {
    const bearer = token.split(' ')[1]; // Format "Bearer <token>"
    const decoded = jwt.verify(bearer, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
