import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Wallet, Users, User as UserIcon, Bell, 
  HelpCircle, Copy, PlayCircle, Briefcase, Mail, 
  Gift, List, ArrowLeft, LogOut, Settings as SettingsIcon,
  Crown, Share2, UploadCloud, CheckCircle, Clock, ChevronRight,
  Facebook, Youtube, Menu, X, Phone, Edit, Shield
} from 'lucide-react';
import { UserStatus, Task } from '../types';

// Layout Component with Bottom Navigation
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useStore();
  const activeTab = location.pathname.split('/')[2] || 'home';

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
      {children}
      
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around p-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => navigate(`/user/${item.id}`)}
            className={`flex flex-col items-center justify-center rounded-2xl w-14 h-14 transition-all duration-300 ${activeTab === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTS FOR PAGES ---

// Dashboard
export const UserDashboard: React.FC = () => {
  const { currentUser, settings, logout } = useStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <UserLayout>
      {/* Side Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black z-[60]" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl p-6">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                   <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-2">
                    <button onClick={() => navigate('/user/profile')} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><UserIcon size={20} className="text-emerald-600"/> My Profile</button>
                    <button onClick={() => navigate('/user/team')} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Users size={20} className="text-emerald-600"/> Referral Team</button>
                    <button onClick={() => window.open(settings.telegramLink)} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><HelpCircle size={20} className="text-emerald-600"/> Support</button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 font-medium"><LogOut size={20}/> Logout</button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white text-gray-800 p-6 pt-8 pb-4 sticky top-0 z-40 border-b border-gray-100">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsDrawerOpen(true)} className="bg-gray-50 p-2.5 rounded-xl hover:bg-gray-100 transition z-50 relative">
                <Menu size={24} className="text-gray-700"/>
             </button>
             <div className="flex items-center gap-2">
                 <img src="https://files.catbox.moe/mmesk9.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover shadow-sm"/>
                 <div>
                   <h2 className="font-extrabold text-lg leading-none">Hi, {currentUser.name.split(' ')[0]}</h2>
                   <span className="text-xs text-gray-400 font-medium">{currentUser.status} Member</span>
                 </div>
             </div>
           </div>
           <div className="flex gap-3">
             <div className="bg-gray-50 p-2.5 rounded-xl relative">
                <Bell size={22} className="text-gray-600" onClick={() => alert("No notifications")} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </div>
           </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="px-6 mt-4">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Balance</p>
                    <h3 className="text-3xl font-black mt-1">৳{currentUser.balanceFree + currentUser.balancePremium}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm cursor-pointer z-10" onClick={() => navigate('/user/wallet')}>
                    <Wallet size={20} className="text-white"/>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 bg-white/10 rounded-xl p-2 px-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[10px] text-gray-300">Main</p>
                    <p className="font-bold">৳{currentUser.balanceFree}</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-2 px-3 backdrop-blur-sm border border-yellow-500/20">
                    <p className="text-[10px] text-yellow-100">Premium</p>
                    <p className="font-bold text-yellow-400">৳{currentUser.balancePremium}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Marquee Notice */}
      <div className="mx-6 mt-6 bg-white rounded-xl shadow-sm p-1 border border-gray-100 flex items-center overflow-hidden">
        <div className="bg-emerald-100 p-1.5 rounded-lg mr-2"><Bell size={14} className="text-emerald-600"/></div>
        <div className="overflow-hidden whitespace-nowrap w-full">
            <motion.div 
            animate={{ x: ["100%", "-100%"] }} 
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="text-xs text-gray-600 font-medium"
            >
            {settings.notice}
            </motion.div>
        </div>
      </div>

      {/* Main Grid Actions (4 Cols) */}
      <div className="grid grid-cols-4 gap-3 px-6 mt-6">
        {[
            { label: 'Free Job', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', link: '/user/free-job' },
            { label: 'Team', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', link: '/user/team' },
            { label: 'Wallet', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '/user/wallet' },
            { label: 'Premium', icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50', link: '/user/premium' },
        ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.link)} className="flex flex-col items-center gap-2 cursor-pointer group z-10">
                <div className={`${item.bg} p-4 rounded-2xl ${item.color} shadow-sm group-active:scale-95 transition-all duration-200 border border-gray-50`}>
                    <item.icon size={22} strokeWidth={2.5}/>
                </div>
                <span className="font-bold text-gray-600 text-[10px] tracking-wide">{item.label}</span>
            </div>
        ))}
      </div>

      {/* Slider */}
      <div className="pl-6 mt-8">
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pr-6">
            {[1,2,3].map(i => (
            <img key={i} src={`https://picsum.photos/400/180?random=${i}`} className="rounded-2xl shadow-md w-[85%] h-32 object-cover shrink-0 snap-center" alt="Banner" />
            ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-6 pb-4 space-y-3 mt-2">
         <h3 className="font-bold text-gray-800 text-sm">Quick Links</h3>
         <button onClick={() => window.open(settings.telegramLink)} className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-98 transition">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Share2 size={18}/></div>
                <span className="font-bold text-sm text-gray-700">Join Telegram Channel</span>
            </div>
            <ChevronRight size={18} className="text-gray-400"/>
         </button>
         <button className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-98 transition">
             <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500"><HelpCircle size={18}/></div>
                <span className="font-bold text-sm text-gray-700">Contact Support</span>
             </div>
             <ChevronRight size={18} className="text-gray-400"/>
         </button>
      </div>
    </UserLayout>
  );
};

// Profile Page (New Implementation)
export const UserProfilePage: React.FC = () => {
    const { currentUser, logout } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    return (
        <UserLayout>
            <div className="bg-white sticky top-0 z-40 p-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate('/user/home')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition z-50"><ArrowLeft size={20}/></button>
                <h1 className="font-bold text-lg">My Profile</h1>
            </div>

            <div className="p-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 border-4 border-white shadow-lg relative">
                        <UserIcon size={40} />
                        <div className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full border-2 border-white">
                            <Edit size={12} className="text-white"/>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{currentUser.name}</h2>
                    <p className="text-sm text-gray-500">{currentUser.phone}</p>
                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${currentUser.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{currentUser.status} Member</span>
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-3">Account Details</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email</span>
                                <span className="text-sm font-medium">{currentUser.email}</span>
                            </div>
                             <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Refer Code</span>
                                <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded flex items-center gap-2">
                                    {currentUser.refCode} <Copy size={12} className="cursor-pointer" onClick={() => navigator.clipboard.writeText(currentUser.refCode)}/>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Joined</span>
                                <span className="text-sm font-medium">{currentUser.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                         <p className="text-xs text-gray-400 font-bold uppercase mb-3">Security</p>
                         <button className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700">
                             Change Password <ChevronRight size={16} className="text-gray-400"/>
                         </button>
                    </div>

                     <button onClick={logout} className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 active:bg-red-100 transition">
                        <LogOut size={18}/> Sign Out
                     </button>
                </div>
            </div>
        </UserLayout>
    )
}

// Wallet Page
export const WalletPage: React.FC = () => {
  const { currentUser, requestWithdraw } = useStore();
  const [tab, setTab] = useState<'MAIN' | 'JOB'>('MAIN');
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');
  const [method, setMethod] = useState('BKASH');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleWithdraw = () => {
      requestWithdraw({
          id: Date.now().toString(),
          userId: currentUser!.id,
          amount: Number(amount),
          number,
          method: method as any,
          type: tab,
          status: 'PENDING',
          date: new Date().toISOString().split('T')[0]
      });
      alert("Withdraw request submitted!");
      setAmount('');
  };

  return (
    <UserLayout>
       <div className="p-6 bg-gray-900 text-white rounded-b-3xl shadow-lg mb-6">
         <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/user/home')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition z-50"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-bold">My Wallet</h1>
         </div>
         
         <div className="flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
               <p className="text-xs text-gray-300 mb-1">Free Balance</p>
               <p className="text-2xl font-bold">৳{currentUser?.balanceFree}</p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 p-4 rounded-2xl shadow-lg shadow-yellow-900/20">
               <p className="text-xs text-yellow-900/70 font-bold mb-1">Premium</p>
               <p className="text-2xl font-black">৳{currentUser?.balancePremium}</p>
            </div>
         </div>
       </div>

       <div className="px-5">
          <div className="bg-white rounded-xl shadow-sm p-1.5 flex mb-6 border border-gray-100">
             <button onClick={() => setTab('MAIN')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition ${tab === 'MAIN' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Main Withdraw</button>
             <button onClick={() => setTab('JOB')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition ${tab === 'JOB' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Job Withdraw</button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
               <h3 className="font-bold text-gray-800 text-base">{tab === 'MAIN' ? 'Withdraw Funds' : 'Job Payment'}</h3>
               
               <div className="space-y-4">
                   <div>
                       <label className="text-xs font-bold text-gray-400 ml-1 block mb-2 uppercase">Payment Method</label>
                       <select value={method} onChange={e => setMethod(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm text-gray-900">
                            <option value="BKASH">Bkash</option>
                            <option value="NAGAD">Nagad</option>
                            <option value="ROCKET">Rocket</option>
                       </select>
                   </div>
                   
                   <div>
                       <label className="text-xs font-bold text-gray-400 ml-1 block mb-2 uppercase">Amount</label>
                       <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-mono text-sm text-gray-900" />
                   </div>

                   <div>
                       <label className="text-xs font-bold text-gray-400 ml-1 block mb-2 uppercase">Wallet Number</label>
                       <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="017..." className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-mono text-sm text-gray-900" />
                   </div>

                   {tab === 'JOB' && (
                       <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center text-gray-400 hover:bg-gray-50 transition cursor-pointer">
                          <UploadCloud className="mx-auto mb-2 text-emerald-500"/>
                          <span className="text-xs font-medium">Upload Job Proof Screenshot</span>
                       </div>
                   )}
                   
                   <button onClick={handleWithdraw} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 mt-2 active:scale-95 transition z-10">Confirm Withdrawal</button>
               </div>
          </motion.div>
       </div>
    </UserLayout>
  );
}

// Free Job Main Page
export const FreeJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
       <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
          <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full z-50"><ArrowLeft size={24} className="text-gray-700"/></button>
          <h1 className="font-bold text-lg text-gray-800">Task Center</h1>
       </div>
       
       <div className="p-5 space-y-3">
          {[
              { title: 'Work Video', subtitle: 'Learn how to work', icon: PlayCircle, color: 'text-red-500', bg: 'bg-red-50', action: 'Watch', link: '#' },
              { title: 'Daily Tasks', subtitle: 'Complete tasks & earn', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', action: 'Start', link: '/user/tasks' },
              { title: 'Gmail Sale', subtitle: 'Sell verified accounts', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50', action: 'Sell', link: '#' },
              { title: 'Ref Quiz', subtitle: 'Math quiz & bonus', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-50', action: 'Play', link: '/user/quiz' },
          ].map((item, idx) => (
            <div key={idx} onClick={() => item.link !== '#' && navigate(item.link)} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer active:scale-95 transition border border-gray-100 z-10">
                <div className="flex items-center gap-4">
                    <div className={`${item.bg} p-3 rounded-xl ${item.color}`}>
                        <item.icon size={24}/>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${item.bg} ${item.color}`}>{item.action}</span>
                </div>
            </div>
          ))}

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mt-6">
              <h3 className="font-bold text-blue-800 mb-2 text-sm">Instructions</h3>
              <p className="text-xs text-blue-600 leading-relaxed">
                  Please watch the "Work Video" before starting any task. Incorrect submissions will be rejected.
              </p>
          </div>
       </div>
    </div>
  );
};

// Task List Page
export const TaskListPage: React.FC = () => {
    const { tasks, submitTask, currentUser } = useStore();
    const navigate = useNavigate();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [proof, setProof] = useState('');

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const handleSubmit = () => {
        if(!selectedTask || !currentUser) return;
        submitTask({
            id: Date.now().toString(),
            taskId: selectedTask.id,
            userId: currentUser.id,
            proofLink: proof,
            details: 'Task Completed',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0],
            amount: selectedTask.amount
        });
        alert("Task Submitted Successfully!");
        setSelectedTask(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative">
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-40">
                <button onClick={() => navigate('/user/free-job')} className="z-50 p-2 hover:bg-gray-100 rounded-full"><ArrowLeft/></button>
                <h1 className="font-bold text-lg">Daily Tasks</h1>
            </div>

            <div className="p-4 space-y-4 pb-20">
                {tasks.filter(t => t.type === 'FREE').map(task => (
                    <div key={task.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="h-32 bg-gray-200 overflow-hidden relative">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <span className="text-white font-bold">{task.category}</span>
                             </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-base">{task.title}</h3>
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">৳{task.amount}</span>
                            </div>
                            <p className="text-gray-500 text-xs mb-4 line-clamp-2">{task.description}</p>
                            <button onClick={() => setSelectedTask(task)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm z-10 relative">Start Task</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Submission Modal */}
            <AnimatePresence>
            {selectedTask && (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 bg-white z-50 overflow-y-auto">
                    <div className="p-4">
                        <button onClick={() => setSelectedTask(null)} className="mb-4 bg-gray-100 p-2 rounded-full"><ArrowLeft/></button>
                        <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
                        <div className="bg-orange-50 p-4 rounded-xl text-xs text-orange-700 mb-6 border border-orange-100 leading-relaxed">
                            {selectedTask.description}. Click the link below to perform the task.
                        </div>

                        <a href={selectedTask.link} target="_blank" rel="noreferrer" className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold mb-6 shadow-lg shadow-blue-200">Go To Link</a>

                        <div className="space-y-4">
                            <h3 className="font-bold text-sm">Submit Proof</h3>
                            <input type="text" placeholder="Enter Proof Link / Text" value={proof} onChange={e => setProof(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm text-gray-900" />
                            <div className="border-2 border-dashed border-gray-200 p-8 rounded-2xl text-center text-gray-400">
                                <UploadCloud className="mx-auto mb-2"/>
                                <span className="text-xs">Upload Screenshot (Mock)</span>
                            </div>
                            <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg">Submit Task</button>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

// Quiz Page
export const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, settings, updateUser } = useStore();
    const [q, setQ] = useState({ a: 0, b: 0 });
    const [ans, setAns] = useState('');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    useEffect(() => {
        setQ({ a: Math.floor(Math.random() * 20), b: Math.floor(Math.random() * 20) });
    }, []);

    if (!currentUser) return null;

    const handleAnswer = () => {
        if (Number(ans) === q.a + q.b) {
            setTimer(10);
            setTimeout(() => {
                alert(`Correct! You earned ৳${settings.quizReward}`);
                if(currentUser) {
                    updateUser({ ...currentUser, balanceFree: currentUser.balanceFree + settings.quizReward });
                }
                setTimer(0);
                setAns('');
                navigate('/user/home');
            }, 5000); 
        } else {
            alert("Wrong Answer!");
        }
    };

    return (
        <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col items-center justify-center p-6 relative">
            <button onClick={() => navigate('/user/home')} className="absolute top-6 left-6 p-2 bg-gray-50 rounded-full z-50"><ArrowLeft size={20}/></button>
            <h2 className="text-2xl font-black text-gray-800 mb-8">Daily Quiz</h2>
            
            {timer > 0 ? (
                <div className="text-center">
                    <p className="text-4xl font-bold text-orange-500 mb-2 animate-pulse">{timer}s</p>
                    <p className="text-gray-500 text-sm">Wait to claim reward...</p>
                </div>
            ) : (
                <div className="w-full bg-slate-50 p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                    <p className="text-4xl font-black text-gray-800 mb-8">{q.a} + {q.b} = ?</p>
                    <input type="number" value={ans} onChange={e => setAns(e.target.value)} className="w-full p-4 text-center text-2xl bg-white rounded-2xl mb-6 shadow-sm outline-none font-bold text-gray-900" placeholder="?" />
                    <button onClick={handleAnswer} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 z-10 relative">Submit</button>
                </div>
            )}
        </div>
    );
};

// Team Page
export const TeamPage: React.FC = () => {
    const { currentUser, users, settings } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const myReferrals = users.filter(u => u.uplineCode === currentUser?.refCode);
    const upline = users.find(u => u.refCode === currentUser?.uplineCode);

    return (
        <UserLayout>
             <div className="bg-purple-600 text-white p-6 rounded-b-3xl mb-6 shadow-lg shadow-purple-200">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate('/user/home')} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition z-50"><ArrowLeft size={20}/></button>
                    <h1 className="text-xl font-bold">My Team</h1>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs text-purple-100 font-bold uppercase">Team Members</p>
                        <p className="text-4xl font-black mt-1">{myReferrals.length}</p>
                    </div>
                    <Users size={40} className="opacity-50"/>
                </div>
                
                {upline && (
                    <div className="text-xs text-purple-200 bg-black/20 px-3 py-1.5 rounded-full inline-block">
                        Upline: {upline.name}
                    </div>
                )}
            </div>

            <div className="px-5 pb-20">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">Referral List</h3>
                
                {myReferrals.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 bg-white rounded-2xl border border-gray-50">
                        <Users size={48} className="mx-auto mb-3 opacity-20"/>
                        <p className="text-sm">No team members yet.</p>
                        <div className="mt-4 bg-gray-50 inline-block px-4 py-2 rounded-lg text-xs font-mono">
                            Code: {currentUser?.refCode}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myReferrals.map(member => (
                            <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{member.name}</p>
                                        <p className="text-xs text-gray-400">{member.phone.substring(0,5)}***</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${member.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

// Premium Page
export const PremiumPage: React.FC = () => {
    const { settings, currentUser } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) navigate('/login');
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-slate-50 max-w-md mx-auto">
            <div className="bg-yellow-500 p-4 text-white flex items-center gap-4 sticky top-0 shadow-md z-50">
                <button onClick={() => navigate('/user/home')} className="z-50 p-2 hover:bg-white/20 rounded-full transition"><ArrowLeft/></button>
                <h1 className="font-bold text-lg">Premium Membership</h1>
            </div>

            <div className="p-6">
                {currentUser?.status === UserStatus.PREMIUM ? (
                    <div className="text-center py-10 bg-white rounded-3xl shadow-lg border border-yellow-100">
                        <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Crown size={48} className="text-yellow-500 fill-yellow-500"/>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">You are Premium!</h2>
                        <p className="text-gray-500 mt-2 px-6">Enjoy unlimited earnings, premium tasks, and instant withdrawals.</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-8 px-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="font-bold text-sm">Facebook Sale</p></div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="font-bold text-sm">TikTok Sale</p></div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-yellow-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-4 py-2 rounded-bl-2xl text-white">LIFETIME</div>
                        <div className="text-center mb-8 mt-4">
                            <h2 className="text-xl font-bold text-gray-800">Upgrade to Premium</h2>
                            <p className="text-sm text-gray-500 mt-2">Unlock exclusive tasks and higher withdrawals.</p>
                            <div className="flex items-baseline justify-center gap-1 mt-6">
                                <span className="text-4xl font-black text-emerald-600">৳{settings.premiumCost}</span>
                                <span className="text-gray-400 text-sm">/ once</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase">Bkash Personal</p>
                                <p className="text-xl font-mono text-gray-800 font-bold">{settings.contactNumber}</p>
                                <button onClick={() => {navigator.clipboard.writeText(settings.contactNumber); alert("Copied")}} className="text-xs text-emerald-600 mt-1 font-bold underline z-10 relative">Tap to Copy</button>
                            </div>
                            
                            <h4 className="font-bold text-sm mt-4 text-gray-700">Submit Payment Details</h4>
                            <select className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium text-gray-900">
                                <option>Bkash</option>
                                <option>Nagad</option>
                            </select>
                            <input type="text" placeholder="Sender Number" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-mono text-sm text-gray-900"/>
                            <input type="text" placeholder="Transaction ID" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-mono text-sm text-gray-900"/>
                            <button className="w-full bg-yellow-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-yellow-200 hover:bg-yellow-600 transition transform active:scale-95 mt-4 z-10 relative">Activate Account</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};