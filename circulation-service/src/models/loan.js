import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING, // Thêm cho tiện hiển thị UI
    allowNull: false,
    defaultValue: 'Sinh viên A',
  },
  bookId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookTitle: {
    type: DataTypes.STRING, // Thêm cho tiện hiển thị
    allowNull: false,
    defaultValue: 'Tên sách',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'BORROWED', 'RETURNED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  borrowDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fineAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'loans',
  timestamps: true,
});

export default Loan;
