import Book from '../models/book.js';

export const createBook = async (bookData) => {
  const existingBook = await Book.findOne({ ISBN: bookData.ISBN });
  if (existingBook) {
    throw new Error(`Sách với mã ISBN ${bookData.ISBN} đã tồn tại trong hệ thống`);
  }
  
  // Khi tạo mới, availableQuantity mặc định bằng quantity
  if (bookData.quantity !== undefined && bookData.availableQuantity === undefined) {
    bookData.availableQuantity = bookData.quantity;
  }
  
  const book = new Book(bookData);
  return await book.save();
};

export const getAllBooks = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  
  // Tìm kiếm theo từ khóa (text search)
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  // Tìm theo danh mục
  if (filters.category) {
    query.category = filters.category;
  }
  
  // Tìm theo tác giả
  if (filters.author) {
    query.author = { $regex: filters.author, $options: 'i' };
  }

  // Lọc theo trạng thái còn sách hay không
  if (filters.available === 'true') {
    query.availableQuantity = { $gt: 0 };
  }

  const skip = (page - 1) * limit;
  
  const books = await Book.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Book.countDocuments(query);
  
  return {
    books,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

export const getBookById = async (id) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Không tìm thấy sách với ID yêu cầu');
  }
  return book;
};

export const updateBook = async (id, updateData) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Không tìm thấy sách để cập nhật');
  }
  
  // Nếu cập nhật số lượng tổng (quantity), cần cập nhật cả availableQuantity một cách hợp lý
  if (updateData.quantity !== undefined) {
    const diff = updateData.quantity - book.quantity;
    updateData.availableQuantity = Math.max(0, book.availableQuantity + diff);
  }
  
  return await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteBook = async (id) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new Error('Không tìm thấy sách để xóa');
  }
  await Book.findByIdAndDelete(id);
  return { message: 'Xóa sách thành công' };
};

// Hàm cập nhật tồn kho dựa trên sự kiện từ RabbitMQ (mượn/trả sách)
export const updateStockByISBN = async (isbn, changeAmount) => {
  const book = await Book.findOne({ ISBN: isbn });
  if (!book) {
    console.error(`[Stock Sync] Không tìm thấy sách với ISBN: ${isbn}`);
    return null;
  }
  
  const newAvailable = book.availableQuantity + changeAmount;
  if (newAvailable < 0 || newAvailable > book.quantity) {
    console.warn(`[Stock Sync] Cảnh báo: Số lượng khả dụng sau khi đổi (${newAvailable}) nằm ngoài phạm vi hợp lệ cho ISBN: ${isbn}`);
  }
  
  book.availableQuantity = Math.max(0, Math.min(book.quantity, newAvailable));
  await book.save();
  
  console.log(`[Stock Sync] Đã cập nhật tồn kho cho ISBN ${isbn}: ${book.availableQuantity}/${book.quantity}`);
  return book;
};
