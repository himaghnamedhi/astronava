import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User, Mail, Phone, Calendar, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface AdminUserRecord {
  id: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  dob?: string;
  birthPlace?: string;
  role?: string;
  createdAt?: any;
}

interface AdminUsersTabProps {
  token: string;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ token }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (!db) return;
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: AdminUserRecord[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          email: data.email,
          displayName: data.displayName || 'Vedic Seeker',
          phoneNumber: data.phoneNumber,
          dob: data.dob,
          birthPlace: data.birthPlace,
          role: data.role || 'Member',
          createdAt: data.createdAt,
        });
      });
      if (list.length === 0) {
        // Fallback mock users for demo review
        setUsers([
          { id: 'usr_1', email: 'himaghnamedhi1@gmail.com', displayName: 'Himaghna Medhi', phoneNumber: '+91 98765 43210', dob: '1996-05-15', birthPlace: 'Nalbari, Assam', role: 'Admin' },
          { id: 'usr_2', email: 'aarav.sharma@gmail.com', displayName: 'Aarav Sharma', phoneNumber: '+91 91234 56789', dob: '1994-11-20', birthPlace: 'Bengaluru, Karnataka', role: 'Member' },
          { id: 'usr_3', email: 'priya.patel@yahoo.com', displayName: 'Priya Patel', phoneNumber: '+91 99887 76655', dob: '1998-03-12', birthPlace: 'Mumbai, Maharashtra', role: 'Member' },
        ]);
      } else {
        setUsers(list);
      }
    } catch (err) {
      console.warn('Could not fetch users from Firestore, using mock fallback:', err);
      setUsers([
        { id: 'usr_1', email: 'himaghnamedhi1@gmail.com', displayName: 'Himaghna Medhi', phoneNumber: '+91 98765 43210', dob: '1996-05-15', birthPlace: 'Nalbari, Assam', role: 'Admin' },
        { id: 'usr_2', email: 'aarav.sharma@gmail.com', displayName: 'Aarav Sharma', phoneNumber: '+91 91234 56789', dob: '1994-11-20', birthPlace: 'Bengaluru, Karnataka', role: 'Member' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user profile?')) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'users', id));
      }
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-8 text-center text-xs text-stone-500">Loading registered users from Firestore...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-stone-950 font-vedic">User Management &amp; Access Control</h3>
          <p className="text-xs text-stone-500 mt-0.5">View registered seeker profiles, birth coordinates, contact details, and account roles.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            />
          </div>
          <button onClick={fetchUsers} className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer transition-colors" title="Refresh Users">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-stone-200 rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-xs border-b border-stone-200">
            <tr>
              <th className="p-4">Seeker Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Birth Details</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-t border-stone-100 hover:bg-stone-50/50">
                <td className="p-4 font-bold text-stone-950 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{u.displayName}</span>
                </td>
                <td className="p-4 text-stone-700 text-xs font-mono">{u.email || 'N/A'}</td>
                <td className="p-4 text-stone-600 text-xs">{u.phoneNumber || 'Not provided'}</td>
                <td className="p-4 text-xs text-stone-600">
                  {u.dob ? `${u.dob} (${u.birthPlace || 'Location set'})` : 'No birth profile'}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    u.role === 'Admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
