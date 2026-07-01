import express from 'express';
import * as bookController from '../controllers/bookController.js';

const router = express.Router();

// Route cho cả Độc giả (tìm kiếm) và Admin (quản lý)
router.get('/', bookController.listBooks);
router.get('/:id', bookController.getBookDetail);

// Các route dành riêng cho Admin để quản lý danh mục (CRUD)
// Trong thực tế, các route này sẽ đi kèm middleware checkAdmin từ Gateway hoặc Auth Service
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
