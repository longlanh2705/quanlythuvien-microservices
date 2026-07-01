import express from 'express';
import * as loanController from '../controllers/loanController.js';

const router = express.Router();

router.post('/', loanController.requestLoan); // SV bấm mượn sách
router.get('/', loanController.getAllLoans); // Thủ thư xem danh sách
router.get('/user/:userId', loanController.getLoansByUser); // Xem lịch sử mượn trả của user
router.post('/direct', loanController.createDirectLoan); // Thủ thư tạo trực tiếp
router.put('/:id/approve', loanController.approveLoan); // Thủ thư duyệt
router.put('/:id/return', loanController.returnBook); // Thủ thư thu hồi sách
router.put('/:id/extend', loanController.extendLoan); // Gia hạn mượn sách

export default router;
