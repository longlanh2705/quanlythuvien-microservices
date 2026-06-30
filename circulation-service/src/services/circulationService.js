import Loan from '../models/loan.js';

/**
 * Lấy lịch sử mượn trả của một user, có phân trang.
 * Tự động cập nhật trạng thái OVERDUE cho các phiếu quá hạn chưa trả.
 */
export const getHistoryByUserId = async (userId, page = 1, limit = 10) => {
  const now = new Date();

  // Tự động cập nhật các phiếu BORROWED đã quá hạn thành OVERDUE
  await Loan.updateMany(
    { userId: String(userId), status: 'BORROWED', dueDate: { $lt: now } },
    { $set: { status: 'OVERDUE' } }
  );

  const skip = (page - 1) * limit;

  const [loans, total] = await Promise.all([
    Loan.find({ userId: String(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Loan.countDocuments({ userId: String(userId) }),
  ]);

  return {
    loans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Lấy thống kê mượn trả nhanh cho một user.
 */
export const getStatsByUserId = async (userId) => {
  const now = new Date();

  // Cập nhật OVERDUE trước khi lấy stats
  await Loan.updateMany(
    { userId: String(userId), status: 'BORROWED', dueDate: { $lt: now } },
    { $set: { status: 'OVERDUE' } }
  );

  const stats = await Loan.aggregate([
    { $match: { userId: String(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { BORROWED: 0, RETURNED: 0, OVERDUE: 0, total: 0 };
  stats.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  return result;
};
