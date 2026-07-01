import Penalty from '../models/penalty.js';

export const getAllPenalties = async (req, res) => {
  try {
    const penalties = await Penalty.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: penalties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payPenalty = async (req, res) => {
  try {
    const { id } = req.params;
    const penalty = await Penalty.findByPk(id);
    
    if (!penalty) return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn phạt' });
    if (penalty.status === 'PAID') return res.status(400).json({ success: false, message: 'Hóa đơn này đã được thu' });

    penalty.status = 'PAID';
    penalty.paidAt = new Date();
    await penalty.save();

    res.status(200).json({ success: true, message: 'Thu tiền phạt thành công!', data: penalty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
