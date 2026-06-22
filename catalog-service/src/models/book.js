import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề sách là bắt buộc'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Tác giả sách là bắt buộc'],
      trim: true,
    },
    ISBN: {
      type: String,
      required: [true, 'Mã ISBN là bắt buộc'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Danh mục sách là bắt buộc'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng sách nhập kho là bắt buộc'],
      min: [0, 'Số lượng không thể nhỏ hơn 0'],
      default: 1,
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Số lượng tồn kho khả dụng là bắt buộc'],
      min: [0, 'Số lượng khả dụng không thể nhỏ hơn 0'],
      default: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String, // Vị trí kệ sách, ví dụ: "Kệ A1, Tầng 2"
      trim: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Index cho tìm kiếm văn bản nhanh trên title và author
bookSchema.index({ title: 'text', author: 'text', category: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
