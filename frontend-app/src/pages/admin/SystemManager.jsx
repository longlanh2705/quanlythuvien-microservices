import React, { useState, useEffect } from 'react';
import { Save, Plus, Shield, Settings } from 'lucide-react';
import { getSettings, updateSetting } from '../../services/settingService';
import { getUsers, createStaff } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const SystemManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('SETTINGS'); // SETTINGS, STAFF
  
  // Settings State
  const [settings, setSettings] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Staff State
  const [staffs, setStaffs] = useState([]);
  const [loadingStaffs, setLoadingStaffs] = useState(true);
  const [newStaff, setNewStaff] = useState({ username: '', password: '', fullName: '', role: 'LIBRARIAN' });

  useEffect(() => {
    fetchSettings();
    if (activeTab === 'STAFF') fetchStaffs();
  }, [activeTab]);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await getSettings();
      const settingsMap = {};
      (res.data || []).forEach(s => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    } catch (err) {
      alert('Lỗi tải cài đặt: ' + (err.message || ''));
    }
    setLoadingSettings(false);
  };

  const fetchStaffs = async () => {
    setLoadingStaffs(true);
    try {
      const res = await getUsers();
      // Lọc ra các account không phải là STUDENT
      setStaffs((res.data || []).filter(u => u.role !== 'STUDENT'));
    } catch (err) {
      alert('Lỗi tải danh sách nhân viên: ' + (err.message || ''));
    }
    setLoadingStaffs(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSetting('MAX_BORROW_DAYS', settings['MAX_BORROW_DAYS']);
      await updateSetting('FINE_PER_DAY', settings['FINE_PER_DAY']);
      await updateSetting('MAX_BOOKS', settings['MAX_BOOKS']);
      alert('Đã lưu cấu hình hệ thống thành công!');
    } catch (err) {
      alert('Lỗi lưu cài đặt: ' + (err.message || ''));
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await createStaff(newStaff);
      alert('Tạo tài khoản nhân viên thành công!');
      setNewStaff({ username: '', password: '', fullName: '', role: 'LIBRARIAN' });
      fetchStaffs();
    } catch (err) {
      alert('Lỗi tạo nhân viên: ' + (err.message || ''));
    }
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return <div style={{ padding: '2rem' }}>Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Quản trị Hệ thống</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'SETTINGS' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('SETTINGS')}>
          <Settings size={18} style={{ display: 'inline', marginBottom: '-2px' }} /> Cài đặt Quy định
        </button>
        <button className={`btn ${activeTab === 'STAFF' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('STAFF')}>
          <Shield size={18} style={{ display: 'inline', marginBottom: '-2px' }} /> Quản lý Nhân viên
        </button>
      </div>

      {activeTab === 'SETTINGS' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Thông số cốt lõi</h2>
          {loadingSettings ? <p>Đang tải...</p> : (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Số ngày mượn tối đa</label>
                <input type="number" required min="1" value={settings['MAX_BORROW_DAYS'] || ''} onChange={e => setSettings({...settings, MAX_BORROW_DAYS: e.target.value})} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tiền phạt mỗi ngày trễ hạn (VNĐ)</label>
                <input type="number" required min="0" value={settings['FINE_PER_DAY'] || ''} onChange={e => setSettings({...settings, FINE_PER_DAY: e.target.value})} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Số lượng sách tối đa được mượn cùng lúc</label>
                <input type="number" required min="1" value={settings['MAX_BOOKS'] || ''} onChange={e => setSettings({...settings, MAX_BOOKS: e.target.value})} className="input-field" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><Save size={18} style={{ display: 'inline', marginBottom: '-2px' }} /> Lưu Thay Đổi</button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'STAFF' && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Cột trái: Form tạo */}
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Tạo Tài Khoản Mới</h3>
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tên đăng nhập *</label>
                <input required type="text" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Mật khẩu *</label>
                <input required type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Họ và tên</label>
                <input required type="text" value={newStaff.fullName} onChange={e => setNewStaff({...newStaff, fullName: e.target.value})} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Vai trò (Quyền hạn) *</label>
                <select required value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="input-field" style={{ background: 'var(--bg-dark)' }}>
                  <option value="LIBRARIAN">Thủ thư (Quản lý mượn/trả)</option>
                  <option value="INVENTORY">Thủ kho (Quản lý sách)</option>
                  <option value="SUPER_ADMIN">Quản trị viên (Toàn quyền)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}><Plus size={18} style={{ display: 'inline', marginBottom: '-2px' }} /> Tạo Nhân Viên</button>
            </form>
          </div>

          {/* Cột phải: Danh sách */}
          <div className="glass-panel" style={{ padding: '1rem', flex: 2, overflowX: 'auto', minWidth: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Tên đăng nhập</th>
                  <th style={{ padding: '1rem' }}>Họ Tên</th>
                  <th style={{ padding: '1rem' }}>Vai Trò</th>
                </tr>
              </thead>
              <tbody>
                {loadingStaffs ? (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Đang tải...</td></tr>
                ) : staffs.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Không có nhân viên nào</td></tr>
                ) : (
                  staffs.map(staff => (
                    <tr key={staff.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{staff.username}</td>
                      <td style={{ padding: '1rem' }}>{staff.fullName}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', borderRadius: '4px' }}>{staff.role}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemManager;
