import * as bookService from '../services/bookService.js';

export const listBooks = async (req, res) => {
  try {
    const { search, category, author, available, page, limit } = req.query;
    
    const filters = { search, category, author, available };
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    
    const result = await bookService.getAllBooks(filters, pageNum, limitNum);
    res.status(200).json({
      success: true,
      data: result.books,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách sách',
      error: error.message,
    });
  }
};

export const getBookDetail = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo sách mới thành công',
      data: newBook,
    });
  } catch (error) {
    const statusCode = error.message.includes('đã tồn tại') ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updatedBook = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: updatedBook,
    });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await bookService.deleteBook(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
