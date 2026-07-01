import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAsRead } from '../services/notificationService';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const res = await getNotifications(user.username);
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Tự động làm mới mỗi 30s
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-primary)' }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'var(--accent-red)', color: 'white',
            borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass-panel" style={{
          position: 'absolute', top: '40px', right: '0', width: '350px',
          maxHeight: '400px', overflowY: 'auto', zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', margin: 0 }}>Thông báo</h3>
          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Không có thông báo nào</div>
          ) : (
            notifications.map(n => (
              <div key={n._id} onClick={() => !n.isRead && handleRead(n._id)} style={{
                padding: '1rem', borderBottom: '1px solid var(--glass-border)',
                background: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                cursor: n.isRead ? 'default' : 'pointer'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--accent-blue)' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{n.message}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                  {new Date(n.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
