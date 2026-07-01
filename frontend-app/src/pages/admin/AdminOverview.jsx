import React, { useState, useEffect } from 'react';
import { Book, Users, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getBooks } from '../../services/bookService';
import { getUsers } from '../../services/userService';
import { getLoans } from '../../services/circulationService';
import { getPenalties } from '../../services/penaltyService';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', background: `rgba(${color}, 0.1)`, borderRadius: 'var(--radius-md)', color: `rgb(${color})` }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</h3>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    borrowedLoans: 0,
    overdueLoans: 0,
  });
  const [topBooks, setTopBooks] = useState([]);
  const [violators, setViolators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [booksRes, usersRes, loansRes, penaltiesRes] = await Promise.all([
          getBooks(),
          getUsers(),
          getLoans(),
          getPenalties()
        ]);

        const books = booksRes.data || [];
        const users = (usersRes.data || []).filter(u => u.role !== 'ADMIN');
        const loans = loansRes.data || [];
        const penalties = penaltiesRes.data || [];

        // 1. Calculate stats
        const borrowed = loans.filter(l => l.status === 'BORROWED');
        const overdue = borrowed.filter(l => l.dueDate && new Date(l.dueDate) < new Date());
        
        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          borrowedLoans: borrowed.length,
          overdueLoans: overdue.length,
        });

        // 2. Calculate Top 5 Borrowed Books
        const bookCountMap = {};
        loans.forEach(l => {
          if (!bookCountMap[l.bookTitle]) {
            bookCountMap[l.bookTitle] = 0;
          }
          bookCountMap[l.bookTitle]++;
        });
        
        const sortedBooks = Object.keys(bookCountMap)
          .map(title => ({ name: title, borrows: bookCountMap[title] }))
          .sort((a, b) => b.borrows - a.borrows)
          .slice(0, 5);
          
        setTopBooks(sortedBooks);

        // 3. Compile Violators (Overdue + Unpaid Penalties)
        const vMap = {};
        
        // Add Overdue users
        overdue.forEach(l => {
          if (!vMap[l.userId]) vMap[l.userId] = { userId: l.userId, userName: l.userName, issues: [] };
          vMap[l.userId].issues.push(`Quá hạn sách: ${l.bookTitle}`);
        });

        // Add Unpaid penalties users
        penalties.filter(p => p.status === 'UNPAID').forEach(p => {
          if (!vMap[p.userId]) vMap[p.userId] = { userId: p.userId, userName: p.userName, issues: [] };
          vMap[p.userId].issues.push(`Nợ phạt: ${p.amount.toLocaleString()}đ (${p.reason})`);
        });

        setViolators(Object.values(vMap));

      } catch (err) {
        console.error("Dashboard error:", err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu Dashboard...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tổng Quan Hệ Thống</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Tổng số Sách" value={stats.totalBooks} icon={<Book size={28} />} color="59, 130, 246" />
        <StatCard title="Độc giả (Sinh viên)" value={stats.totalUsers} icon={<Users size={28} />} color="139, 92, 246" />
        <StatCard title="Đang Mượn" value={stats.borrowedLoans} icon={<ArrowRightLeft size={28} />} color="16, 185, 129" />
        <StatCard title="Quá hạn" value={stats.overdueLoans} icon={<AlertTriangle size={28} />} color="239, 68, 68" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Biểu đồ sách mượn nhiều */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Top 5 Sách được mượn nhiều nhất</h3>
          <div style={{ width: '100%', height: '300px' }}>
            {topBooks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Chưa có dữ liệu mượn sách</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={topBooks} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                  <Bar dataKey="borrows" radius={[0, 4, 4, 0]}>
                    {topBooks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${260 + index * 15}, 70%, 60%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Danh sách rủi ro */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} /> Danh sách Vi phạm / Quá hạn
          </h3>
          {violators.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Tuyệt vời! Không có ai đang nợ sách quá hạn hay tiền phạt.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {violators.map((v, i) => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '3px solid var(--accent-red)', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{v.userName} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'normal' }}>({v.userId})</span></div>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {v.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
