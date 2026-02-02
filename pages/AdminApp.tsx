
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { 
    Users, DollarSign, List, Settings, LogOut, CheckCircle, XCircle, Trash2, 
    Plus, Briefcase, Home, Shield, Activity, Save, Edit, Search, UserCheck, 
    MessageSquare, AlertCircle, Facebook, Instagram, Mail, Video, LayoutDashboard,
    CreditCard, Headphones, Image, UploadCloud, Menu, X, ArrowLeft
} from 'lucide-react';
import { UserStatus, Task } from '../types';

// --- SIDEBAR COMPONENT ---
const Sidebar: React.FC<{ 
    activeTab: string, 
    setTab: (t: any) => void, 
    logout: () => void,
    isOpen: boolean,
    closeMobile: () => void 
}> = ({ activeTab, setTab, logout, isOpen, closeMobile }) => {
    const navigate = useNavigate();
    
    const menuItems = [
        { id: 'DASH', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'USERS', icon: Users, label: 'All Users' },
        { id: 'PREMIUM', icon: Shield, label: 'Premium & Settings' },
        { id: 'TASKS', icon: Briefcase, label: 'Task Manager' },
        { id: 'SOCIAL', icon: Facebook, label: 'Social Media' },
        { id: 'WITHDRAW', icon: CreditCard, label: 'Withdrawals' },
        { id: 'SUPPORT', icon: Headphones, label: 'Support & Links' },
        { id: 'SETTINGS', icon: Settings, label: 'Main Settings' },
    ];

    const handleNavigation = (id: string) => {
        setTab(id);
        closeMobile();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={closeMobile}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 p-2 rounded-lg text-white"><Shield size={24} /></div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                            <p className="text-xs text-slate-500">v2.0.0 Pro</p>
                        </div>
                    </div>
                    <button onClick={closeMobile} className="md:hidden text-slate-400"><X size={24}/></button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-4 p-4 hover:bg-slate-800 transition border-l-4 ${activeTab === item.id ? 'bg-slate-800 border-emerald-500 text-white' : 'border-transparent'}`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-emerald-500' : ''}/>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button onClick={() => navigate('/user/home')} className="w-full flex items-center justify-center gap-2 bg-emerald-600/10 text-emerald-500 p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition font-bold text-sm">
                        <ArrowLeft size={18} /> Switch to User View
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition font-bold text-sm">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </>
    );
};

// --- USER EDIT MODAL ---
const UserEditModal: React.FC<{ user: any, onClose: () => void, onSave: (u: any) => void, onDelete: (id: string) => void }> = ({ user, onClose, onSave, onDelete }) => {
    const [data, setData] = useState({ ...user });
    const [amount, setAmount] = useState('');

    const handleBalance = (type: 'ADD' | 'CUT') => {
        const val = Number(amount);
        if (!val) return;
        const newBal = type === 'ADD' ? data.balanceFree + val : data.balanceFree - val;
        setData({ ...data, balanceFree: newBal });
        setAmount('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Edit User: {user.name}</h2>
                    <button onClick={onClose}><XCircle size={24} className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                            <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                            <input type="text" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input type="text" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                            <input type="text" value={data.password} onChange={e => setData({...data, password: e.target.value})} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Manage Free Balance (Current: ৳{data.balanceFree})</label>
                        <div className="flex gap-2">
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="flex-1 p-2 border rounded-lg" />
                            <button onClick={() => handleBalance('ADD')} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs">Add</button>
                            <button onClick={() => handleBalance('CUT')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs">Cut</button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700">Account Status</span>
                        <button onClick={() => setData({...data, isBlocked: !data.isBlocked})} className={`px-4 py-2 rounded-lg font-bold text-xs ${data.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {data.isBlocked ? 'Blocked' : 'Active'}
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button onClick={() => onDelete(data.id)} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">Delete User</button>
                    <button onClick={() => { onSave(data); onClose(); }} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN ADMIN COMPONENT ---
export const AdminDashboard: React.FC = () => {
  const { 
      users, tasks, submissions, withdrawals, jobWithdrawals, tickets, premiumRequests, settings, isAdmin,
      logout, updateUser, deleteUser, approvePremium, rejectPremium, addTask, deleteTask, 
      approveTask, rejectTask, approveWithdraw, rejectWithdraw, submitJobWithdraw, submitTicket, updateSettings 
  } = useStore();
  
  const [view, setView] = useState('DASH');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({ type: 'FREE', category: 'YOUTUBE' });
  const [subTab, setSubTab] = useState('LIST'); // LIST, SETTINGS
  const navigate = useNavigate();

  // Admin Security Check
  useEffect(() => {
      if (!isAdmin) {
          navigate('/login');
      }
  }, [isAdmin, navigate]);

  // Analytics Logic
  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.status === UserStatus.PREMIUM).length,
    pendingPremium: premiumRequests.filter(p => p.status === 'PENDING').length,
    pendingTasks: submissions.filter(s => s.status === 'PENDING').length,
    pendingJobWithdraw: jobWithdrawals.filter(j => j.status === 'PENDING').length,
    pendingMainWithdraw: withdrawals.filter(w => w.status === 'PENDING').length,
    pendingTickets: tickets.filter(t => t.status === 'OPEN').length,
    pendingFB: submissions.filter(s => s.status === 'PENDING' && s.taskTitle?.toLowerCase().includes('facebook')).length,
    pendingInsta: submissions.filter(s => s.status === 'PENDING' && s.taskTitle?.toLowerCase().includes('instagram')).length,
    pendingGmail: submissions.filter(s => s.status === 'PENDING' && s.taskTitle?.toLowerCase().includes('gmail')).length,
  };

  const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Settings Saved Successfully!");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex relative">
        {/* Responsive Sidebar */}
        <Sidebar 
            activeTab={view} 
            setTab={setView} 
            logout={logout} 
            isOpen={mobileMenuOpen} 
            closeMobile={() => setMobileMenuOpen(false)} 
        />

        {/* Main Content */}
        <div className="flex-1 w-full p-4 md:p-6 overflow-x-hidden">
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden flex justify-between items-center mb-6 bg-slate-900 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileMenuOpen(true)} className="p-1">
                        <Menu size={24}/>
                    </button>
                    <h1 className="font-bold">Admin Panel</h1>
                </div>
                <button onClick={() => navigate('/user/home')} className="bg-white/10 p-2 rounded-full">
                    <ArrowLeft size={18}/>
                </button>
            </div>

            {/* DASHBOARD VIEW */}
            {view === 'DASH' && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h2>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Users', val: stats.totalUsers, color: 'bg-blue-500', icon: Users },
                            { label: 'Premium Users', val: stats.premiumUsers, color: 'bg-yellow-500', icon: Shield },
                            { label: 'Pending Premium', val: stats.pendingPremium, color: 'bg-purple-500', icon: Activity },
                            { label: 'Task Pending', val: stats.pendingTasks, color: 'bg-emerald-500', icon: Briefcase },
                            { label: 'Job Withdraw', val: stats.pendingJobWithdraw, color: 'bg-orange-500', icon: UploadCloud },
                            { label: 'Main Withdraw', val: stats.pendingMainWithdraw, color: 'bg-red-500', icon: CreditCard },
                            { label: 'Tickets', val: stats.pendingTickets, color: 'bg-pink-500', icon: MessageSquare },
                            { label: 'Gmail Orders', val: stats.pendingGmail, color: 'bg-indigo-500', icon: Mail },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.val}</h3>
                                    </div>
                                    <div className={`${stat.color} p-2 rounded-lg text-white shadow-lg shadow-${stat.color}/30`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
                        <h3 className="font-bold text-slate-700 mb-4">User Growth Analytics</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[{name: 'Mon', u: 10}, {name: 'Tue', u: 20}, {name: 'Wed', u: 15}, {name: 'Thu', u: 30}, {name: 'Fri', u: 50}]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                                <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}/>
                                <Line type="monotone" dataKey="u" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* USERS VIEW */}
            {view === 'USERS' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                            <input type="text" placeholder="Search phone..." className="w-full md:w-64 pl-10 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Balance</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.filter(u => u.phone.includes(searchTerm)).map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-emerald-600 font-bold">F: ৳{u.balanceFree}</div>
                                            <div className="text-yellow-600 font-bold text-xs">P: ৳{u.balancePremium}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{u.status}</span>
                                            {u.isBlocked && <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">BLOCKED</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setEditingUser(u)} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700"><Edit size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {editingUser && <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={updateUser} onDelete={deleteUser} />}
                </div>
            )}

            {/* PREMIUM VIEW */}
            {view === 'PREMIUM' && (
                <div className="space-y-6">
                    <div className="flex gap-4 border-b border-slate-200 pb-2">
                        <button onClick={() => setSubTab('LIST')} className={`pb-2 px-4 font-bold text-sm ${subTab === 'LIST' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}>Requests</button>
                        <button onClick={() => setSubTab('SETTINGS')} className={`pb-2 px-4 font-bold text-sm ${subTab === 'SETTINGS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}>Settings</button>
                    </div>

                    {subTab === 'LIST' ? (
                        <div className="grid gap-4">
                            {premiumRequests.map(req => (
                                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div>
                                        <p className="font-bold text-slate-800">User ID: {req.userId}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-1">{req.method} • {req.senderNumber} • Trx: {req.trxId}</p>
                                        <p className="text-xs font-bold text-emerald-600 mt-1">Amount: ৳{req.amount}</p>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {req.status === 'PENDING' ? (
                                            <>
                                                <button onClick={() => approvePremium(req.id)} className="flex-1 md:flex-none bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 flex justify-center"><CheckCircle size={20}/></button>
                                                <button onClick={() => rejectPremium(req.id)} className="flex-1 md:flex-none bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex justify-center"><XCircle size={20}/></button>
                                            </>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{req.status}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {premiumRequests.length === 0 && <p className="text-center text-slate-400 py-10">No requests found.</p>}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-lg">
                            <h3 className="font-bold mb-4">Premium Configurations</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Premium Cost</label>
                                    <input type="number" value={settings.premiumCost} onChange={e => updateSettings({...settings, premiumCost: Number(e.target.value)})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Referral Bonus</label>
                                    <input type="number" value={settings.refBonus} onChange={e => updateSettings({...settings, refBonus: Number(e.target.value)})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Registration Bonus (Free)</label>
                                    <input type="number" value={settings.regBonus} onChange={e => updateSettings({...settings, regBonus: Number(e.target.value)})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Payment Number</label>
                                    <input type="text" value={settings.contactNumber} onChange={e => updateSettings({...settings, contactNumber: e.target.value})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-bold">Premium Activation</span>
                                    <button onClick={() => updateSettings({...settings, isPremiumActive: !settings.isPremiumActive})} className={`w-12 h-6 rounded-full relative transition ${settings.isPremiumActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.isPremiumActive ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Save Settings</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TASKS VIEW */}
            {view === 'TASKS' && (
                <div className="space-y-6">
                    <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
                        <button onClick={() => setSubTab('LIST')} className={`pb-2 px-4 font-bold text-sm whitespace-nowrap ${subTab === 'LIST' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}>Task List</button>
                        <button onClick={() => setSubTab('SUBMISSIONS')} className={`pb-2 px-4 font-bold text-sm whitespace-nowrap ${subTab === 'SUBMISSIONS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}>Submissions</button>
                        <button onClick={() => setSubTab('SETTINGS')} className={`pb-2 px-4 font-bold text-sm whitespace-nowrap ${subTab === 'SETTINGS' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}>Settings</button>
                    </div>

                    {subTab === 'LIST' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold mb-4">Add New Task</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Task Title" className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, title: e.target.value})} value={newTask.title || ''}/>
                                    <input type="text" placeholder="Description" className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, description: e.target.value})} value={newTask.description || ''}/>
                                    <input type="text" placeholder="Image URL" className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, image: e.target.value})} value={newTask.image || ''}/>
                                    <input type="text" placeholder="Task Link" className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, link: e.target.value})} value={newTask.link || ''}/>
                                    <input type="number" placeholder="Reward Amount" className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, amount: Number(e.target.value)})} value={newTask.amount || ''}/>
                                    <select className="p-3 border rounded-xl" onChange={e => setNewTask({...newTask, type: e.target.value as any})} value={newTask.type}>
                                        <option value="FREE">Free</option>
                                        <option value="PREMIUM">Premium</option>
                                    </select>
                                    <button onClick={() => {
                                        addTask({ ...newTask, id: Date.now().toString() } as Task);
                                        setNewTask({ type: 'FREE', category: 'YOUTUBE' });
                                        alert("Task Added");
                                    }} className="bg-emerald-600 text-white py-3 rounded-xl font-bold col-span-2">Create Task</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {tasks.map(t => (
                                    <div key={t.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                                        <div>
                                            <p className="font-bold text-slate-800">{t.title}</p>
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">{t.type}</span>
                                        </div>
                                        <button onClick={() => deleteTask(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {subTab === 'SUBMISSIONS' && (
                        <div className="space-y-4">
                            {submissions.filter(s => s.status === 'PENDING').map(sub => (
                                <div key={sub.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between mb-2">
                                        <p className="font-bold text-sm">User: {sub.userId}</p>
                                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">Task: {sub.taskTitle || 'Unknown'}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg text-xs font-mono text-slate-600 mb-3 break-all">{sub.proofLink}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => approveTask(sub.id)} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600">Approve</button>
                                        <button onClick={() => rejectTask(sub.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-600">Reject</button>
                                    </div>
                                </div>
                            ))}
                            {submissions.filter(s => s.status === 'PENDING').length === 0 && <p className="text-center text-slate-400 py-10">No pending submissions</p>}
                        </div>
                    )}

                    {subTab === 'SETTINGS' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-lg">
                            <h3 className="font-bold mb-4">Task Configurations</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Free Task Limit (Daily)</label>
                                    <input type="number" value={settings.dailyFreeTaskLimit} onChange={e => updateSettings({...settings, dailyFreeTaskLimit: Number(e.target.value)})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Premium Task Limit (Daily)</label>
                                    <input type="number" value={settings.dailyPremiumTaskLimit} onChange={e => updateSettings({...settings, dailyPremiumTaskLimit: Number(e.target.value)})} className="w-full p-3 border rounded-xl"/>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-bold">Task System Active</span>
                                    <button onClick={() => updateSettings({...settings, isTaskSystemActive: !settings.isTaskSystemActive})} className={`w-12 h-6 rounded-full relative transition ${settings.isTaskSystemActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.isTaskSystemActive ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <button onClick={handleSaveSettings} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Save Settings</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SOCIAL VIEW */}
            {view === 'SOCIAL' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Social Rates & Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Facebook Rate</label>
                                <input type="number" value={settings.facebookRate} onChange={e => updateSettings({...settings, facebookRate: Number(e.target.value)})} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Gmail Rate</label>
                                <input type="number" value={settings.gmailRate} onChange={e => updateSettings({...settings, gmailRate: Number(e.target.value)})} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Instagram Rate</label>
                                <input type="number" value={settings.instagramRate} onChange={e => updateSettings({...settings, instagramRate: Number(e.target.value)})} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">TikTok Rate</label>
                                <input type="number" value={settings.tiktokRate} onChange={e => updateSettings({...settings, tiktokRate: Number(e.target.value)})} className="w-full p-2 border rounded-lg"/>
                            </div>
                        </div>
                        <button onClick={handleSaveSettings} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold">Update Rates</button>
                    </div>

                    <h3 className="font-bold text-slate-800">Pending Social Tasks</h3>
                    <div className="space-y-3">
                        {submissions.filter(s => s.status === 'PENDING' && (s.taskTitle === 'Gmail Sell' || s.taskTitle?.includes('Facebook'))).map(sub => (
                            <div key={sub.id} className="bg-white p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm border border-slate-100 gap-3">
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{sub.taskTitle}</p>
                                    <p className="text-xs text-slate-500">{sub.proofLink}</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button onClick={() => approveTask(sub.id)} className="flex-1 bg-emerald-100 text-emerald-600 px-3 py-2 md:py-1 rounded text-xs font-bold">Approve</button>
                                    <button onClick={() => rejectTask(sub.id)} className="flex-1 bg-red-100 text-red-600 px-3 py-2 md:py-1 rounded text-xs font-bold">Reject</button>
                                </div>
                            </div>
                        ))}
                        {submissions.filter(s => s.status === 'PENDING' && (s.taskTitle === 'Gmail Sell' || s.taskTitle?.includes('Facebook'))).length === 0 && (
                            <p className="text-center text-slate-400 py-10">No pending social tasks</p>
                        )}
                    </div>
                </div>
            )}

            {/* WITHDRAW VIEW */}
            {view === 'WITHDRAW' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Withdrawal Management</h2>
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase">Job Withdrawals</h3>
                        {jobWithdrawals.filter(j => j.status === 'PENDING').map(jw => (
                            <div key={jw.id} className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
                                <div className="flex justify-between">
                                    <span className="font-bold">{jw.jobType}</span>
                                    <span className="text-emerald-600 font-bold">৳{jw.amountBDT}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Wallet: {jw.walletNumber} | Points: {jw.points}</p>
                                <p className="text-xs text-slate-400 break-all mt-1">Proof: {jw.proofImage}</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => {
                                        submitJobWithdraw({...jw, status: 'APPROVED'});
                                    }} className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-xs font-bold">Mark Paid</button>
                                    <button onClick={() => submitJobWithdraw({...jw, status: 'REJECTED'})} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-xs font-bold">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase">Main Wallet Withdrawals</h3>
                        {withdrawals.filter(w => w.status === 'PENDING').map(w => (
                            <div key={w.id} className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                                <div className="flex justify-between">
                                    <span className="font-bold">৳{w.amount}</span>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">{w.type}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{w.method} • {w.number}</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => approveWithdraw(w.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold">Approve</button>
                                    <button onClick={() => rejectWithdraw(w.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SUPPORT VIEW */}
            {view === 'SUPPORT' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-4">Support Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Premium Group Link 1" className="p-3 border rounded-xl" value={settings.premiumGroupLink1} onChange={e => updateSettings({...settings, premiumGroupLink1: e.target.value})}/>
                            <input type="text" placeholder="Premium Group Link 2" className="p-3 border rounded-xl" value={settings.premiumGroupLink2} onChange={e => updateSettings({...settings, premiumGroupLink2: e.target.value})}/>
                            <input type="text" placeholder="Support Number" className="p-3 border rounded-xl" value={settings.supportNumber} onChange={e => updateSettings({...settings, supportNumber: e.target.value})}/>
                        </div>
                        <button onClick={handleSaveSettings} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold">Update Links</button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-800">Support Tickets</h3>
                        {tickets.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm">{t.subject}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{t.message}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.status === 'OPEN' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{t.status}</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-50 text-xs text-slate-400">
                                    User ID: {t.userId} • {t.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SETTINGS VIEW */}
            {view === 'SETTINGS' && (
                <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                            <input type="text" value={settings.companyName} onChange={e => updateSettings({...settings, companyName: e.target.value})} className="w-full p-3 border rounded-xl"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notice Marquee</label>
                            <textarea value={settings.notice} onChange={e => updateSettings({...settings, notice: e.target.value})} className="w-full p-3 border rounded-xl h-24"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Landing Page Text</label>
                            <textarea value={settings.landingText} onChange={e => updateSettings({...settings, landingText: e.target.value})} className="w-full p-3 border rounded-xl h-24"/>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Home Slider Images (Links)</label>
                            {settings.sliderImages.map((img, idx) => (
                                <input key={idx} type="text" value={img} onChange={e => {
                                    const newImages = [...settings.sliderImages];
                                    newImages[idx] = e.target.value;
                                    updateSettings({...settings, sliderImages: newImages});
                                }} className="w-full p-3 border rounded-xl mb-2" placeholder={`Image URL ${idx+1}`}/>
                            ))}
                        </div>

                        <button onClick={handleSaveSettings} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg mt-4">Save All Changes</button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
