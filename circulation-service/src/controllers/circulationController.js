import * as circulationService from '../services/circulationService.js';

// Giới hạn pagination
const PAGE_MIN  = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 50;

const parsePagination = (query) => {
  let page  = parseInt(query.page,  10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page)  || page  < PAGE_MIN)  page  = 1;
  if (isNaN(limit) || limit < LIMIT_MIN) limit = 5;
  if (limit > LIMIT_MAX) limit = LIMIT_MAX;

  return { page, limit };
};

// ─── GET /api/circulation/history ─────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng từ token.' });
    }

    const { page, limit } = parsePagination(req.query);
    const { loans, pagination } = await circulationService.getHistoryByUserId(userId, page, limit);

    res.status(200).json({ success: true, data: loans, pagination });
  } catch (error) {
    console.error('[Circulation] Lỗi getHistory:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử mượn trả.' });
  }
};

// ─── GET /api/circulation/stats ────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng từ token.' });
    }

    const stats = await circulationService.getStatsByUserId(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('[Circulation] Lỗi getStats:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê.' });
  }
};
