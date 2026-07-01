import Loan from '../models/loan.js';
import Penalty from '../models/penalty.js';
import Setting from '../models/setting.js';

const getSettingValue = async (key, defaultVal) => {
  const s = await Setting.findByPk(key);
  return s ? parseInt(s.value) : defaultVal;
};

export const requestLoan = async (req, res) => {
  try {
    const { userId, bookId, userName, bookTitle } = req.body;
    
    // Tạo phiếu mượn chờ duyệt
    const newLoan = await Loan.create({
      userId,
      bookId,
      userName: userName || 'Sinh viên',
      bookTitle: bookTitle || 'Tên sách ẩn',
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Đã gửi yêu cầu mượn sách. Vui lòng đến quầy nhận sách!',
      data: newLoan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDirectLoan = async (req, res) => {
  try {
    const { userId, bookId, userName, bookTitle } = req.body;
    
    const maxDays = await getSettingValue('MAX_BORROW_DAYS', 14);
    
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + maxDays);

    const newLoan = await Loan.create({
      userId,
      bookId,
      userName: userName || 'Sinh viên',
      bookTitle: bookTitle || 'Tên sách ẩn',
      status: 'BORROWED',
      borrowDate,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: 'Tạo phiếu mượn trực tiếp thành công!',
      data: newLoan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoansByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loans = await Loan.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByPk(id);
    
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });
    if (loan.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Phiếu này không ở trạng thái chờ duyệt' });

    // Tính ngày mượn và ngày trả
    const maxDays = await getSettingValue('MAX_BORROW_DAYS', 14);
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + maxDays);

    loan.status = 'BORROWED';
    loan.borrowDate = borrowDate;
    loan.dueDate = dueDate;
    await loan.save();

    res.status(200).json({ success: true, message: 'Đã duyệt cho mượn sách!', data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { damageFee, damageNote } = req.body; // Thêm fee từ client
    
    const loan = await Loan.findByPk(id);
    
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });
    if (loan.status !== 'BORROWED') return res.status(400).json({ success: false, message: 'Sách này chưa được mượn hoặc đã trả rồi' });

    loan.status = 'RETURNED';
    loan.returnDate = new Date();
    
    // Tính tiền phạt trễ hạn
    let lateFee = 0;
    if (loan.returnDate > loan.dueDate) {
      const finePerDay = await getSettingValue('FINE_PER_DAY', 5000);
      const diffTime = Math.abs(loan.returnDate - loan.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      lateFee = diffDays * finePerDay;
    }

    const dFee = parseInt(damageFee) || 0;
    const totalFine = lateFee + dFee;
    
    loan.fineAmount = totalFine;
    await loan.save();

    if (totalFine > 0) {
      let reason = [];
      if (lateFee > 0) reason.push(`Trễ hạn (${lateFee}đ)`);
      if (dFee > 0) reason.push(`${damageNote || 'Hư hỏng/Mất sách'} (${dFee}đ)`);

      await Penalty.create({
        loanId: loan.id,
        userId: loan.userId,
        userName: loan.userName,
        amount: totalFine,
        reason: reason.join(' + '),
        status: 'UNPAID'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: totalFine > 0 ? `Trả sách thành công. Có phát sinh phạt ${totalFine}đ` : 'Trả sách thành công', 
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const extendLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByPk(id);
    
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });
    if (loan.status !== 'BORROWED') return res.status(400).json({ success: false, message: 'Sách này chưa được mượn hoặc đã trả rồi' });

    // Cộng thêm ngày gia hạn
    const maxDays = await getSettingValue('MAX_BORROW_DAYS', 14);
    const newDueDate = new Date(loan.dueDate);
    newDueDate.setDate(newDueDate.getDate() + maxDays);
    loan.dueDate = newDueDate;
    
    await loan.save();

    res.status(200).json({ 
      success: true, 
      message: `Gia hạn thành công thêm ${maxDays} ngày`, 
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
