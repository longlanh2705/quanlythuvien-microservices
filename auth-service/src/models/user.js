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
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'STUDENT',
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'LOCKED', 'PENDING'),
    defaultValue: 'PENDING',
  }
}, {
  timestamps: true,
});

export default User;
