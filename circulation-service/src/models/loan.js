import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // UUID từ PostgreSQL (auth-service)
      required: [true, 'UserID là bắt buộc'],
      index: true,
    },
    bookId: {
      type: String, // ObjectId từ MongoDB (catalog-service)
      required: [true, 'BookID là bắt buộc'],
    },
    bookTitle: {
      type: String,
      required: [true, 'Tên sách là bắt buộc'],
      trim: true,
    },
    bookAuthor: {
      type: String,
      trim: true,
      default: '',
    },
    bookISBN: {
      type: String,
      trim: true,
      default: '',
    },
    borrowDate: {
      type: Date,
      required: [true, 'Ngày mượn là bắt buộc'],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Hạn trả là bắt buộc'],
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['BORROWED', 'RETURNED', 'OVERDUE'],
      default: 'BORROWED',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh theo userId + status
loanSchema.index({ userId: 1, status: 1 });
loanSchema.index({ userId: 1, createdAt: -1 });

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
