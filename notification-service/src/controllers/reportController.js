// Trong thực tế, service này sẽ dùng Axios để gọi qua Circulation Service lấy dữ liệu.
// Nhưng ở đây ta mô phỏng logic xuất báo cáo.
import axios from 'axios';

export const exportFinesReport = async (req, res) => {
  try {
    // Gọi sang circulation-service để lấy dữ liệu phiếu mượn
    const circRes = await axios.get('http://localhost:5003/api/loans');
    const loans = circRes.data.data;

    // Lọc ra các phiếu có tiền phạt
    const fines = loans.filter(loan => loan.fineAmount > 0).map(loan => ({
      loanId: loan.id,
      userId: loan.userId,
      userName: loan.userName,
      bookTitle: loan.bookTitle,
      fineAmount: loan.fineAmount,
      date: loan.returnDate || 'Chưa trả'
    }));

    const totalFines = fines.reduce((sum, item) => sum + item.fineAmount, 0);

    // Trả về JSON tổng hợp
    res.status(200).json({
      success: true,
      data: {
        totalFines,
        recordCount: fines.length,
        records: fines,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo báo cáo: ' + error.message });
  }
};
