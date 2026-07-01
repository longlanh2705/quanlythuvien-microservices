import Setting from '../models/setting.js';

// Khởi tạo cài đặt mặc định nếu chưa có
export const initDefaultSettings = async () => {
  const defaults = [
    { key: 'MAX_BORROW_DAYS', value: '14', description: 'Số ngày mượn tối đa' },
    { key: 'FINE_PER_DAY', value: '5000', description: 'Số tiền phạt mỗi ngày trễ hạn (VNĐ)' },
    { key: 'MAX_BOOKS', value: '3', description: 'Số lượng sách tối đa được mượn cùng lúc' }
  ];

  for (const s of defaults) {
    await Setting.findOrCreate({
      where: { key: s.key },
      defaults: { value: s.value, description: s.description }
    });
  }
};

export const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const setting = await Setting.findByPk(key);
    if (!setting) return res.status(404).json({ success: false, message: 'Không tìm thấy cài đặt' });

    setting.value = String(value);
    await setting.save();

    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
