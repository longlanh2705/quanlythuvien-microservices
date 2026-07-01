import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Penalty = sequelize.define('Penalty', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanId: {
    type: DataTypes.STRING, // To link with Loan if needed
    allowNull: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Sinh viên',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Vi phạm', // Trễ hạn, Hư hỏng, Mất sách
  },
  status: {
    type: DataTypes.ENUM('UNPAID', 'PAID'),
    defaultValue: 'UNPAID',
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'penalties',
  timestamps: true,
});

export default Penalty;
