import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // Với admin: 'admin'. Với sinh viên: 'Mã sinh viên' (VD: SV2021001)
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'STUDENT'),
    allowNull: false,
    defaultValue: 'STUDENT',
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default User;
