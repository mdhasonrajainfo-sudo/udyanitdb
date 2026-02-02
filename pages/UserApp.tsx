
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Wallet, Users, User as UserIcon, Bell, 
  HelpCircle, Copy, PlayCircle, Briefcase, Mail, 
  Gift, List, ArrowLeft, ArrowRight, LogOut, Settings as SettingsIcon,
  Crown, Share2, UploadCloud, CheckCircle, Clock, ChevronRight,
  Facebook, Youtube, Menu, X, Phone, Edit, Shield, Eye, EyeOff, Send, MessageCircle,
  Headphones, Globe, Star, XCircle, FileText, Camera, Video, MonitorPlay, AlertTriangle, Lock, Image as ImageIcon,
  Gem, CreditCard, DollarSign, Calendar, TrendingUp, Activity, CheckSquare, Instagram, Loader, ShoppingBag, 
  Key, UserCheck, AlertOctagon, AlertCircle
} from 'lucide-react';
import { UserStatus, Task } from '../types';

// --- TOAST CONTEXT ---

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{ showToast: (msg: string, type?: 'success' | 'error' | 'info') => void } | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none gap-2 px-4">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full shadow-xl border ${
                                t.type === 'success' ? 'bg-white border-emerald-500 text-emerald-700' : 
                                t.type === 'error' ? 'bg-white border-red-500 text-red-700' : 
                                'bg-white border-blue-500 text-blue-700'
                            }`}
                        >
                            {t.type === 'success' && <CheckCircle size={20} className="fill-emerald-100"/>}
                            {t.type === 'error' && <AlertTriangle size={20} className="fill-red-100"/>}
                            {t.type === 'info' && <Lock size={20} className="fill-blue-100"/>}
                            <span className="font-bold text-sm">{t.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

// --- SHARED COMPONENTS ---

const FooterSection: React.FC = () => {
    const { settings } = useStore();
    return (
        <div className="bg-white rounded-t-[2.5rem] shadow-[0_-5px_30px_rgba(0,0,0,0.03)] border-t border-gray-100 pt-8 pb-10 px-6 mt-8">
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => window.open(settings.telegramLink)} className="bg-sky-50 p-3 rounded-xl flex items-center gap-3 border border-sky-100 hover:bg-sky-100 transition">
                    <div className="bg-sky-500 text-white p-2 rounded-lg"><Send size={16}/></div>
                    <span className="text-xs font-bold text-sky-800">Telegram Channel</span>
                </button>
                <button onClick={() => window.open(settings.telegramLink)} className="bg-indigo-50 p-3 rounded-xl flex items-center gap-3 border border-indigo-100 hover:bg-indigo-100 transition">
                    <div className="bg-indigo-500 text-white p-2 rounded-lg"><MessageCircle size={16}/></div>
                    <span className="text-xs font-bold text-indigo-800">Telegram Group</span>
                </button>
                <button onClick={() => window.open(settings.facebookLink)} className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 border border-blue-100 hover:bg-blue-100 transition">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Facebook size={16}/></div>
                    <span className="text-xs font-bold text-blue-800">Facebook Group</span>
                </button>
                <button onClick={() => window.open(settings.youtubeLink)} className="bg-red-50 p-3 rounded-xl flex items-center gap-3 border border-red-100 hover:bg-red-100 transition">
                    <div className="bg-red-600 text-white p-2 rounded-lg"><Youtube size={16}/></div>
                    <span className="text-xs font-bold text-red-800">YouTube Channel</span>
                </button>
            </div>

            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center border border-gray-100 p-2">
                    <img src="https://files.catbox.moe/mmesk9.jpg" alt="Logo" className="w-full h-full object-contain"/>
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">{settings.companyName}</h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-[250px] mx-auto leading-relaxed">{settings.landingText}</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                            Md. Founder Name <CheckCircle size={14} className="text-blue-500 fill-white"/>
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Founder & CEO</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-50">
                    {[Facebook, Youtube, Send, MessageCircle, Share2, Globe].map((Icon, i) => (
                        <div key={i} className="text-gray-400 hover:text-emerald-600 transition cursor-pointer">
                            <Icon size={20}/>
                        </div>
                    ))}
                </div>
                
                <p className="text-[10px] text-gray-300 mt-6">© 2024 All Rights Reserved</p>
            </div>
        </div>
    );
};

// Layout Component
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[2] || 'home';

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 transition-colors duration-300">
        <div className="min-h-screen bg-slate-50 pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
        {children}
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
    </div>
  );
};

// --- COMPONENTS FOR PAGES ---

// Dashboard
export const UserDashboard: React.FC = () => {
  const { currentUser, settings, users, logout, unreadCount } = useStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            const maxScroll = scrollWidth - clientWidth;
            let nextScroll = scrollLeft + clientWidth;
            let nextIndex = currentSlide + 1;

            if (scrollLeft >= maxScroll - 10) {
                nextScroll = 0;
                nextIndex = 0;
            }

            sliderRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
            setCurrentSlide(nextIndex);
        }
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentSlide]);

  if (!currentUser) return null;

  const upline = users.find(u => u.refCode === currentUser.uplineCode);

  return (
    <UserLayout>
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black z-[60]" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl overflow-y-auto">
                <div className="bg-emerald-600 p-6 pt-10 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-16 h-16 bg-white rounded-full border-2 border-emerald-300 overflow-hidden">
                            <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`} alt="Profile" className="w-full h-full object-cover"/>
                        </div>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-1 bg-white/20 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg leading-tight">{currentUser.name}</h2>
                        {currentUser.status === 'PREMIUM' && <CheckCircle size={16} className="text-yellow-300 fill-yellow-600"/>}
                    </div>
                    <p className="text-emerald-100 text-xs mt-1">Joined: {currentUser.joinDate}</p>
                    <div className="flex items-center gap-2 mt-3 bg-emerald-700/50 p-2 rounded-lg text-xs">
                        <Phone size={14}/> {currentUser.phone}
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <button onClick={() => {navigate('/user/home'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Home size={20} className="text-emerald-600"/> Dashboard</button>
                    <button onClick={() => {navigate('/user/notifications'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium relative">
                        <Bell size={20} className="text-emerald-600"/> Notifications
                        {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full absolute right-4">{unreadCount}</span>}
                    </button>
                    <button onClick={() => {navigate('/user/work-video'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Video size={20} className="text-emerald-600"/> Work Video</button>
                    <button onClick={() => {navigate('/user/job-withdraw'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><UploadCloud size={20} className="text-emerald-600"/> Job Withdraw</button>
                    <button onClick={() => {navigate('/user/wallet', { state: { view: 'WITHDRAW_FORM' } }); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><Wallet size={20} className="text-emerald-600"/> Withdraw</button>
                    <button onClick={() => {navigate('/user/income-history'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><List size={20} className="text-emerald-600"/> Income History</button>
                    <button onClick={() => {navigate('/support'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><HelpCircle size={20} className="text-emerald-600"/> Support</button>
                    <button onClick={() => {navigate('/user/profile'); setIsDrawerOpen(false);}} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl text-gray-700 font-medium"><SettingsIcon size={20} className="text-emerald-600"/> Settings</button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl text-red-600 font-medium"><LogOut size={20}/> Logout</button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="bg-emerald-600 text-white p-5 pb-16 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsDrawerOpen(true)} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition">
                <Menu size={24} className="text-white"/>
             </button>
             <div className="bg-white px-2 py-1 rounded-lg flex items-center gap-1">
                <img src="https://files.catbox.moe/mmesk9.jpg" alt="Logo" className="w-6 h-6 object-contain"/>
                <span className="text-gray-900 font-black text-xs tracking-tighter">{settings.companyName}</span>
             </div>
           </div>
           
           <div className="flex gap-3">
             <button onClick={() => navigate('/support')} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition">
                <Headphones size={22} className="text-white"/>
             </button>
             <button onClick={() => navigate('/user/notifications')} className="bg-white/20 p-2 rounded-xl relative hover:bg-white/30 transition">
                <Bell size={22} className="text-white" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold">{unreadCount}</span>}
             </button>
           </div>
        </div>
      </header>

      <div className="px-5 -mt-10 mb-4 z-40 relative">
          <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between border border-gray-100 relative overflow-hidden">
             <button onClick={() => setShowContact(!showContact)} className="absolute top-3 right-3 text-gray-400 hover:text-emerald-600 transition">
                 {showContact ? <EyeOff size={18}/> : <Eye size={18}/>}
             </button>

             <div className="w-20 h-20 rounded-full border-4 border-emerald-50 shadow-sm overflow-hidden flex-shrink-0 bg-gray-100 mr-4">
                 <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=059669&color=fff`} alt="Profile" className="w-full h-full object-cover"/>
             </div>

             <div className="flex-1">
                 <div className="flex items-center gap-1">
                    <h2 className="text-lg font-black text-gray-800">{currentUser.name}</h2>
                    {currentUser.status === 'PREMIUM' && <CheckCircle size={14} className="text-blue-500 fill-white"/>}
                 </div>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase inline-block mb-1 ${currentUser.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {currentUser.status} Member
                 </span>
                 <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                    Ref: <span className="text-gray-800 font-bold bg-gray-50 px-1 rounded font-mono">{currentUser.refCode}</span>
                    <Copy size={12} className="cursor-pointer text-emerald-600" onClick={() => {navigator.clipboard.writeText(currentUser.refCode); alert("Copied!")}}/>
                 </p>
                 <p className="text-[10px] text-gray-400 mt-1">Joined: {currentUser.joinDate}</p>
             </div>
          </div>

          <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">My WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800 font-mono tracking-tight">
                      {showContact ? currentUser.phone : currentUser.phone.substring(0, 3) + '****' + currentUser.phone.slice(-3)}
                  </p>
                  <div className="absolute top-2 right-2 text-emerald-100"><Phone size={24}/></div>
              </div>
              <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <p className="text-[10px] text-purple-600 font-bold uppercase mb-1">Upline WhatsApp</p>
                  <p className="text-sm font-bold text-gray-800 font-mono tracking-tight">
                      {upline ? (showContact ? upline.phone : upline.phone.substring(0, 3) + '****' + upline.phone.slice(-3)) : 'N/A'}
                  </p>
                  <div className="absolute top-2 right-2 text-purple-100"><Users size={24}/></div>
              </div>
          </div>
      </div>

      <div className="mx-5 bg-white rounded-xl shadow-sm p-1 border border-gray-100 flex items-center overflow-hidden mb-6">
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

      <div className="px-5 mb-3 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1"></div>
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Start Work</h3>
          <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-5 mb-8">
        {[
            { label: 'Free Job', icon: Briefcase, color: 'text-blue-500', bg: 'bg-white', link: '/user/free-job' },
            { label: 'Team', icon: Users, color: 'text-purple-500', bg: 'bg-white', link: '/user/team' },
            { label: 'Wallet', icon: Wallet, color: 'text-emerald-500', bg: 'bg-white', link: '/user/wallet' },
            { label: 'Premium', icon: Gem, color: 'text-pink-500', bg: 'bg-white', link: '/user/premium' },
        ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.link)} className="flex flex-col items-center gap-1 cursor-pointer group z-10">
                <div className={`${item.bg} p-3 rounded-2xl ${item.color} shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 group-active:scale-95 transition-all duration-200 w-full flex justify-center items-center aspect-square`}>
                    <item.icon size={22} strokeWidth={2}/>
                </div>
                <span className="font-bold text-gray-600 text-[10px] tracking-wide">{item.label}</span>
            </div>
        ))}
      </div>

      <div className="px-5 mb-8 relative">
        <div 
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory scroll-smooth"
            onScroll={() => {}}
        >
            {[1,2,3,4].map(i => (
            <div key={i} className="min-w-full snap-center relative">
                 <img src={`https://picsum.photos/600/300?random=${i+10}`} className="rounded-2xl shadow-md w-full h-40 object-cover" alt="Banner" />
            </div>
            ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {[0,1,2,3].map((idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-4 bg-emerald-600' : 'w-1.5 bg-gray-300'}`}></div>
            ))}
        </div>
      </div>

      <FooterSection />

    </UserLayout>
  );
};

// --- RE-IMPLEMENTING FULL FREE JOB PAGE WITH TABS AS REQUESTED ---
export const FreeJobPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, tasks, submitTask, settings, submissions } = useStore();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'TASKS' | 'GMAIL' | 'QUIZ' | 'INFO'>('TASKS');
    const [proof, setProof] = useState('');
    const [gmailData, setGmailData] = useState({email: '', pass: ''});
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleTaskSubmit = () => {
        if(!selectedTask) return;
        if(!proof) return showToast("Please provide proof", 'error');
        
        // Check Daily Limit
        const todaySubs = submissions.filter(s => s.userId === currentUser?.id && s.date === new Date().toISOString().split('T')[0] && tasks.find(t => t.id === s.taskId)?.type === 'FREE');
        if (todaySubs.length >= settings.dailyFreeTaskLimit) return showToast("Daily Free Task Limit Reached", 'error');

        submitTask({
            id: Date.now().toString(),
            taskId: selectedTask.id,
            userId: currentUser!.id,
            proofLink: proof,
            details: 'Task Completed',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0],
            amount: selectedTask.amount,
            taskTitle: selectedTask.title,
            category: selectedTask.category
        });
        showToast("Task Submitted Successfully!", 'success');
        setSelectedTask(null);
        setProof('');
    };

    const handleGmailSubmit = () => {
        if(!gmailData.email || !gmailData.pass) return showToast("Fill all fields", 'error');
        submitTask({
            id: Date.now().toString(),
            taskId: 'gmail-sell',
            userId: currentUser!.id,
            proofLink: `${gmailData.email} | ${gmailData.pass}`,
            details: 'Gmail Sold',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0],
            amount: settings.gmailRate, 
            taskTitle: 'Gmail Sell',
            category: 'GMAIL'
        });
        showToast("Gmail Submitted for Review", 'success');
        setGmailData({email: '', pass: ''});
    }

    return (
        <UserLayout>
           <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Free Job Area</h1>
            </div>

           <div className="px-5 mt-4">
              <div className="bg-emerald-600 text-white rounded-2xl shadow-lg p-5 flex items-center justify-between relative overflow-hidden">
                  <div className="z-10">
                      <p className="text-[10px] text-emerald-100 font-bold uppercase">Total Free Income</p>
                      <p className="text-2xl font-black">৳{currentUser?.totalIncome}</p>
                  </div>
                  <div className="text-right z-10">
                      <p className="text-[10px] text-emerald-100 font-bold uppercase">Today Income</p>
                      <p className="text-2xl font-black">৳{currentUser?.todayIncome}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              </div>
           </div>

           <div className="grid grid-cols-4 gap-2 px-5 mt-6">
               <button onClick={() => setActiveTab('TASKS')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'TASKS' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                   <div className={`${activeTab === 'TASKS' ? 'text-emerald-600' : 'text-gray-400'}`}><CheckSquare size={20}/></div>
                   <span className={`text-[10px] font-bold ${activeTab === 'TASKS' ? 'text-emerald-700' : 'text-gray-500'}`}>Task</span>
               </button>
               <button onClick={() => setActiveTab('GMAIL')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'GMAIL' ? 'bg-orange-50 border border-orange-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                   <div className={`${activeTab === 'GMAIL' ? 'text-orange-600' : 'text-gray-400'}`}><Mail size={20}/></div>
                   <span className={`text-[10px] font-bold ${activeTab === 'GMAIL' ? 'text-orange-700' : 'text-gray-500'}`}>Gmail</span>
               </button>
               <button onClick={() => setActiveTab('QUIZ')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'QUIZ' ? 'bg-purple-50 border border-purple-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                   <div className={`${activeTab === 'QUIZ' ? 'text-purple-600' : 'text-gray-400'}`}><Gift size={20}/></div>
                   <span className={`text-[10px] font-bold ${activeTab === 'QUIZ' ? 'text-purple-700' : 'text-gray-500'}`}>Quiz</span>
               </button>
               <button onClick={() => setActiveTab('INFO')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'INFO' ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                   <div className={`${activeTab === 'INFO' ? 'text-blue-600' : 'text-gray-400'}`}><HelpCircle size={20}/></div>
                   <span className={`text-[10px] font-bold ${activeTab === 'INFO' ? 'text-blue-700' : 'text-gray-500'}`}>Limit</span>
               </button>
           </div>

           <div className="px-5 mt-6 pb-20">
               {activeTab === 'TASKS' && (
                   <div className="space-y-4">
                       <h3 className="font-bold text-sm text-slate-700 border-l-4 border-emerald-500 pl-2">Available Tasks</h3>
                       {tasks.filter(t => t.type === 'FREE').map(task => (
                           <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                               <div className="flex justify-between items-start">
                                   <div className="flex items-center gap-3">
                                       <img src={task.image} className="w-10 h-10 rounded-lg bg-gray-100 object-cover"/>
                                       <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                                            <span className="text-emerald-600 text-xs font-bold">Reward: ৳{task.amount}</span>
                                       </div>
                                   </div>
                                   <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-500">{task.category}</span>
                               </div>
                               <p className="text-xs text-gray-500">{task.description}</p>
                               <button onClick={() => setSelectedTask(task)} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition">Start Task</button>
                           </div>
                       ))}
                       {tasks.filter(t => t.type === 'FREE').length === 0 && (
                           <div className="text-center py-10">
                               <div className="bg-gray-50 inline-block p-4 rounded-full mb-3"><Briefcase size={24} className="text-gray-400"/></div>
                               <p className="text-gray-500 text-sm font-medium">No tasks available right now.</p>
                           </div>
                       )}
                   </div>
               )}

                {activeTab === 'GMAIL' && (
                    <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                            <Mail size={32} className="text-orange-500 mx-auto mb-2"/>
                            <h3 className="font-bold text-orange-800">Sell Gmail Accounts</h3>
                            <p className="text-xs text-orange-600 mt-1">Rate: ৳{settings.gmailRate} per verified mail</p>
                        </div>
                        <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gmail Address</label>
                                <input type="text" placeholder="example@gmail.com" value={gmailData.email} onChange={e => setGmailData({...gmailData, email: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm border-none outline-none text-slate-900 mt-1"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                                <input type="text" placeholder="Password123" value={gmailData.pass} onChange={e => setGmailData({...gmailData, pass: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm border-none outline-none text-slate-900 mt-1"/>
                            </div>
                            <button onClick={handleGmailSubmit} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 mt-2">Submit for Review</button>
                        </div>
                    </div>
                )}

                {activeTab === 'QUIZ' && (
                    <div className="bg-purple-50 p-6 rounded-2xl text-center border border-purple-100">
                        <Gift size={40} className="text-purple-500 mx-auto mb-4"/>
                        <h3 className="font-bold text-slate-800">Referral Quiz</h3>
                        <p className="text-xs text-gray-500 mb-6">Earn Quizzes by referring friends. 2 Quizzes per invite!</p>
                        <div className="bg-white p-3 rounded-xl mb-4 inline-block shadow-sm">
                            <span className="text-sm font-bold text-purple-600">Available: {currentUser?.quizBalance || 0}</span>
                        </div>
                        <button onClick={() => {
                            if ((currentUser?.quizBalance || 0) <= 0) return showToast("You have no quizzes left!", 'error');
                            navigate('/user/quiz');
                        }} className="block w-full bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-200">Start Quiz</button>
                    </div>
                )}
                
                {activeTab === 'INFO' && (
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><AlertCircle size={18}/> Daily Limits</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex justify-between bg-white/50 p-2 rounded-lg">
                                <span>Free Tasks:</span>
                                <span className="font-bold">{settings.dailyFreeTaskLimit} / day</span>
                            </div>
                            <div className="flex justify-between bg-white/50 p-2 rounded-lg">
                                <span>Premium Tasks:</span>
                                <span className="font-bold">{settings.dailyPremiumTaskLimit} / day</span>
                            </div>
                            <div className="flex justify-between bg-white/50 p-2 rounded-lg">
                                <span>Gmail Sell:</span>
                                <span className="font-bold">Unlimited</span>
                            </div>
                        </div>
                    </div>
                )}
           </div>

           <AnimatePresence>
                {selectedTask && (
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 bg-white z-[60] overflow-y-auto">
                        <div className="p-5">
                            <button onClick={() => setSelectedTask(null)} className="mb-4 bg-gray-100 p-2 rounded-full"><ArrowLeft className="text-slate-800"/></button>
                            <h2 className="text-xl font-bold mb-2 text-slate-800">{selectedTask.title}</h2>
                            <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-800 mb-6 border border-emerald-100">
                                {selectedTask.description}
                            </div>
                            <a href={selectedTask.link} target="_blank" rel="noreferrer" className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold mb-6 shadow-lg">Go To Link</a>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Proof Submission</label>
                                    <input type="text" placeholder="Enter Proof Link / Screenshot URL" value={proof} onChange={e => setProof(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm text-gray-900 mt-1 bg-gray-100" />
                                </div>
                                <button onClick={handleTaskSubmit} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg">Submit Proof</button>
                            </div>
                        </div>
                    </motion.div>
                )}
           </AnimatePresence>
        </UserLayout>
    );
};

// --- RESTORED PROFILE PAGE WITH ADMIN LOGIN ---
export const UserProfilePage: React.FC = () => {
  const { currentUser, logout, updateUser, adminLogin, settings } = useStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: currentUser?.name || '', password: currentUser?.password || '', profilePic: currentUser?.profilePic || '' });
  const [showPolicy, setShowPolicy] = useState(false);

  if (!currentUser) return null;

  const handleUpdate = () => {
      updateUser({ ...currentUser, ...formData });
      setEditing(false);
      showToast("Profile Updated", 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if(ev.target?.result) {
                  const newPic = ev.target.result as string;
                  setFormData(prev => ({...prev, profilePic: newPic}));
                  // Auto save image
                  updateUser({...currentUser, profilePic: newPic});
                  showToast("Photo Updated", 'success');
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  // Specific Admin Login Handler
  const handleAdminLogin = () => {
      if(currentUser.phone === '01772209016') {
          // For profile quick link, we bypass secondary auth assuming they already logged in or let them re-verify
          // But as per user request "admin login option will be there", we redirect to login to do the 2-step
          navigate('/login'); 
      } else {
          showToast("You are not an Admin", 'error');
      }
  }

  return (
    <UserLayout>
        <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
            <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
            <h1 className="text-lg font-bold text-gray-800">My Profile</h1>
        </div>
        
        <div className="p-5 space-y-6 pb-24">
             {/* Profile Header Card */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-50 to-transparent z-0"></div>
                 <div className="relative z-10">
                     <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-emerald-100 shadow-md">
                            <img src={formData.profilePic || `https://ui-avatars.com/api/?name=${currentUser.name}&background=059669&color=fff`} className="w-full h-full object-cover"/>
                        </div>
                        <label className="absolute bottom-0 right-0 bg-slate-900 p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition">
                            <Camera size={14}/>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                        </label>
                     </div>
                     
                     {!editing ? (
                         <>
                            <h2 className="text-2xl font-black text-slate-800 flex justify-center items-center gap-2">
                                {currentUser.name} 
                                {currentUser.status === 'PREMIUM' && <div className="bg-yellow-100 p-1 rounded-full"><CheckCircle size={16} className="text-yellow-600 fill-yellow-100"/></div>}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium mb-4">{currentUser.phone}</p>
                            
                            <div className="flex justify-center gap-3">
                                <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Balance</p>
                                    <p className="font-black text-slate-800">৳{currentUser.balanceFree + currentUser.balancePremium}</p>
                                </div>
                                <div className="bg-purple-50 px-4 py-2 rounded-xl text-center">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase">Income</p>
                                    <p className="font-black text-slate-800">৳{currentUser.totalIncome}</p>
                                </div>
                            </div>

                            <button onClick={() => setEditing(true)} className="mt-6 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1 mx-auto bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition"><Edit size={12}/> Edit Details</button>
                         </>
                     ) : (
                         <div className="space-y-3 mt-4 text-left">
                             <div>
                                 <label className="text-xs font-bold text-gray-400 ml-1">Name</label>
                                 <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none text-slate-900 bg-gray-50" placeholder="Name"/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-400 ml-1">Password</label>
                                 <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none text-slate-900 bg-gray-50" placeholder="Password"/>
                             </div>
                             <div className="flex gap-2 mt-4">
                                 <button onClick={() => setEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-bold">Cancel</button>
                                 <button onClick={handleUpdate} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold shadow-lg">Save</button>
                             </div>
                         </div>
                     )}
                 </div>
             </div>

             {/* Menu List */}
             <div className="space-y-3">
                 {/* Only show Admin Login if user matches */}
                 {currentUser.phone === '01772209016' && (
                     <button onClick={handleAdminLogin} className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-slate-200 hover:scale-[1.02] transition">
                         <div className="flex items-center gap-3"><Shield size={20} className="text-emerald-400"/> <span className="font-bold">Admin Panel Login</span></div>
                         <ChevronRight size={18} className="text-slate-500"/>
                     </button>
                 )}
                 
                 <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                     <button onClick={() => navigate('/user/income-history')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50">
                         <div className="flex items-center gap-3"><List size={18} className="text-blue-500"/> <span className="text-sm font-bold text-gray-700">Income History</span></div>
                         <ChevronRight size={16} className="text-gray-300"/>
                     </button>
                     <button onClick={() => navigate('/user/wallet')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50">
                         <div className="flex items-center gap-3"><Wallet size={18} className="text-emerald-500"/> <span className="text-sm font-bold text-gray-700">Withdraw Funds</span></div>
                         <ChevronRight size={16} className="text-gray-300"/>
                     </button>
                     <button onClick={() => navigate('/user/team')} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50">
                         <div className="flex items-center gap-3"><Users size={18} className="text-purple-500"/> <span className="text-sm font-bold text-gray-700">My Team</span></div>
                         <ChevronRight size={16} className="text-gray-300"/>
                     </button>
                     <button onClick={() => setShowPolicy(!showPolicy)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50">
                         <div className="flex items-center gap-3"><FileText size={18} className="text-orange-500"/> <span className="text-sm font-bold text-gray-700">Privacy Policy</span></div>
                         <ChevronRight size={16} className={`text-gray-300 transition ${showPolicy ? 'rotate-90' : ''}`}/>
                     </button>
                     {showPolicy && (
                         <div className="p-5 text-xs text-gray-500 bg-gray-50 leading-relaxed border-b border-gray-50 whitespace-pre-wrap">
                             {settings.privacyPolicy}
                         </div>
                     )}
                     <button onClick={logout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 group">
                         <div className="flex items-center gap-3"><LogOut size={18} className="text-red-500"/> <span className="text-sm font-bold text-red-600">Logout Account</span></div>
                     </button>
                 </div>
             </div>
             
             <div className="text-center text-[10px] text-gray-400 pt-4">
                 v2.5.0 • {settings.companyName}
             </div>
        </div>
    </UserLayout>
  );
};

// --- UPDATED PREMIUM PAGE WITH PENDING DETAILS ---
export const PremiumPage: React.FC = () => {
    const navigate = useNavigate();
    const { settings, currentUser, premiumRequests } = useStore();
    const { showToast } = useToast();
    const [subPage, setSubPage] = useState<string | null>(null);

    // Check Pending Status and Get Details
    const pendingRequest = premiumRequests.find(r => r.userId === currentUser?.id && r.status === 'PENDING');

    const handleFeatureClick = (feature: string) => {
        if(currentUser?.status === 'FREE') {
            showToast("This service is locked. Please Upgrade.", 'info');
            return;
        }
        setSubPage(feature);
    }

    if (subPage) {
        return <PremiumSubPage type={subPage} onClose={() => setSubPage(null)} />
    }

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Premium Zone</h1>
            </div>

            <div className="p-5">
                {/* Upgrade Section Logic */}
                {currentUser?.status === 'FREE' ? (
                    pendingRequest ? (
                        <div className="w-full bg-orange-50 border border-orange-100 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 animate-pulse">
                                <Clock size={32}/>
                            </div>
                            <h2 className="text-lg font-black text-orange-900 mb-1">Request Under Review</h2>
                            <p className="text-xs text-orange-700 mb-4">Please wait for admin approval (Max 24h)</p>
                            
                            <div className="bg-white p-4 rounded-xl text-left border border-orange-100 shadow-sm space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Submission Details</p>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Method:</span>
                                    <span className="font-bold text-gray-800">{pendingRequest.method}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Sender:</span>
                                    <span className="font-bold text-gray-800 font-mono">{pendingRequest.senderNumber}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">TrxID:</span>
                                    <span className="font-bold text-gray-800 font-mono">{pendingRequest.trxId}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-bold text-emerald-600">৳{pendingRequest.amount}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white mb-8 shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-yellow-500 p-1.5 rounded-lg"><Crown size={20} className="text-white"/></div>
                                    <h3 className="font-bold text-lg">Become Premium</h3>
                                </div>
                                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                                    Unlock higher earning tasks, instant withdrawals, and 24/7 priority support.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {['Unlimited Daily Tasks', 'Double Referral Bonus', 'Instant Withdrawal', 'Premium Support'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs text-slate-200">
                                            <div className="bg-emerald-500/20 p-1 rounded-full"><CheckCircle size={12} className="text-emerald-400"/></div> 
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => navigate('/user/premium-form')} className="w-full bg-yellow-500 text-slate-900 py-3.5 rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2">
                                    Upgrade for ৳{settings.premiumCost} <ArrowRight size={18}/>
                                </button>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        </div>
                    )
                ) : (
                    <div className="w-full bg-emerald-50 text-emerald-800 py-6 rounded-3xl font-bold text-center mb-8 border border-emerald-100 flex flex-col items-center justify-center gap-2 shadow-sm">
                        <div className="bg-white p-3 rounded-full shadow-md">
                            <CheckCircle size={32} className="text-emerald-500 fill-emerald-100"/>
                        </div>
                        <span className="text-lg">Premium Verified</span>
                        <p className="text-xs font-normal text-emerald-600">You have access to all features</p>
                    </div>
                )}

                {/* Premium Services Grid */}
                <h3 className="font-bold text-slate-700 mb-4 pl-3 border-l-4 border-yellow-500 uppercase tracking-wider text-sm">Premium Services</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { id: 'TASK', title: "Prem. Task", icon: Briefcase, color: "text-blue-600" },
                        { id: 'FB', title: "FB Sell", icon: Facebook, color: "text-blue-800" },
                        { id: 'GMAIL', title: "Gmail Sell", icon: Mail, color: "text-red-500" },
                        { id: 'INSTA', title: "Insta Sell", icon: Instagram, color: "text-pink-600" },
                        { id: 'TIKTOK', title: "TikTok Sell", icon: Video, color: "text-black" },
                        { id: 'SUPPORT', title: "VIP Help", icon: Headphones, color: "text-emerald-600" },
                        { id: 'SHOP', title: "Shop", icon: ShoppingBag, color: "text-teal-600" },
                        { id: 'MORE', title: "More", icon: Globe, color: "text-indigo-600" },
                    ].map((item, i) => (
                        <div key={i} onClick={() => handleFeatureClick(item.id)} className={`flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition group ${currentUser?.status === 'FREE' ? 'opacity-60' : ''}`}>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full aspect-square flex items-center justify-center relative group-hover:border-emerald-200 transition">
                                <item.icon size={24} className={item.color}/>
                                {currentUser?.status === 'FREE' && <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center rounded-2xl"><Lock size={16} className="text-gray-400"/></div>}
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
};

// --- ADDITIONAL COMPONENTS ---

export const PremiumSubPage: React.FC<{ type: string, onClose: () => void }> = ({ type, onClose }) => {
    return (
        <div className="min-h-screen bg-white">
            <div className="p-4 flex items-center gap-3 border-b border-gray-100 shadow-sm sticky top-0 bg-white z-50">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">{type === 'TASK' ? 'Premium Tasks' : 'Service Details'}</h1>
            </div>
            <div className="p-5 flex flex-col items-center justify-center min-h-[50vh] text-center">
                 <div className="bg-emerald-50 p-4 rounded-full mb-4">
                    <Shield size={48} className="text-emerald-500" />
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">Coming Soon</h2>
                 <p className="text-gray-500 mt-2 text-sm">This premium feature is under development.</p>
            </div>
        </div>
    );
};

export const WalletPage: React.FC = () => {
    const { currentUser, withdrawals, requestWithdraw } = useStore();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'BKASH'|'NAGAD'|'ROCKET'>('BKASH');
    const [number, setNumber] = useState('');
    const { showToast } = useToast();

    const handleWithdraw = () => {
        const val = Number(amount);
        if(!val || !number) return showToast("Invalid Details", 'error');
        if(val < 100) return showToast("Min Withdraw 100", 'error');
        if(currentUser && val > currentUser.balanceFree) return showToast("Insufficient Balance", 'error');

        requestWithdraw({
            id: Date.now().toString(),
            userId: currentUser!.id,
            amount: val,
            method,
            number,
            type: 'FREE_WALLET',
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0]
        });
        showToast("Request Sent", 'success');
        setAmount('');
        setNumber('');
    };

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">My Wallet</h1>
            </div>
            <div className="p-5">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl mb-6">
                     <p className="text-xs text-slate-400 font-bold uppercase">Total Balance</p>
                     <h2 className="text-3xl font-black mt-1">৳{currentUser ? currentUser.balanceFree + currentUser.balancePremium : 0}</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Withdraw Request</h3>
                    <div className="space-y-4">
                        <select value={method} onChange={e => setMethod(e.target.value as any)} className="w-full p-3 border rounded-xl bg-gray-50">
                            <option value="BKASH">Bkash</option>
                            <option value="NAGAD">Nagad</option>
                            <option value="ROCKET">Rocket</option>
                        </select>
                        <input type="number" placeholder="Amount (Min 100)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50"/>
                        <input type="text" placeholder="Wallet Number" value={number} onChange={e => setNumber(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50"/>
                        <button onClick={handleWithdraw} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Submit Request</button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export const TeamPage: React.FC = () => {
    const { currentUser, users } = useStore();
    const navigate = useNavigate();
    const team = users.filter(u => u.uplineCode === currentUser?.refCode);
    
    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">My Team</h1>
            </div>
            <div className="p-5">
                 <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                         <h3 className="text-2xl font-black text-purple-700">{team.length}</h3>
                         <p className="text-xs text-gray-500 font-bold uppercase">Total Members</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                         <h3 className="text-2xl font-black text-emerald-700">{team.filter(u => u.status === 'PREMIUM').length}</h3>
                         <p className="text-xs text-gray-500 font-bold uppercase">Premium Members</p>
                     </div>
                 </div>

                 <h3 className="font-bold text-gray-800 mb-3">Member List</h3>
                 <div className="space-y-3">
                     {team.map(member => (
                         <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">{member.name.charAt(0)}</div>
                                 <div>
                                     <h4 className="font-bold text-sm text-gray-800">{member.name}</h4>
                                     <p className="text-xs text-gray-400">{member.phone}</p>
                                 </div>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-1 rounded ${member.status === 'PREMIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{member.status}</span>
                         </div>
                     ))}
                     {team.length === 0 && <p className="text-center text-gray-400 py-10">No team members yet.</p>}
                 </div>
            </div>
        </UserLayout>
    );
};

export const QuizPage: React.FC = () => {
    const { currentUser, updateUser } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [qIndex, setQIndex] = useState(0);

    const questions = [
        { q: "What is 2+2?", a: ["3", "4", "5"], c: 1 },
        { q: "Capital of BD?", a: ["Dhaka", "Ctg", "Sylhet"], c: 0 },
        { q: "Color of Sky?", a: ["Green", "Blue", "Red"], c: 1 }
    ];

    const handleAnswer = (idx: number) => {
        if(idx === questions[qIndex].c) {
             showToast("Correct!", 'success');
             if(currentUser) {
                 updateUser({
                     ...currentUser,
                     quizBalance: Math.max(0, currentUser.quizBalance - 1),
                     balanceFree: currentUser.balanceFree + 1 // Reward
                 });
             }
             if(qIndex < questions.length - 1) setQIndex(qIndex + 1);
             else navigate('/user/free-job');
        } else {
            showToast("Wrong!", 'error');
        }
    };

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/free-job')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Quiz</h1>
            </div>
            <div className="p-5 flex flex-col items-center justify-center min-h-[60vh]">
                 <div className="bg-white p-6 rounded-2xl shadow-lg w-full text-center">
                     <h2 className="text-xl font-bold mb-6 text-gray-800">{questions[qIndex].q}</h2>
                     <div className="space-y-3">
                         {questions[qIndex].a.map((ans, i) => (
                             <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl font-bold text-gray-700 text-sm transition border border-gray-100">{ans}</button>
                         ))}
                     </div>
                 </div>
            </div>
        </UserLayout>
    );
};

export const TaskListPage: React.FC = () => {
    const { tasks } = useStore();
    const navigate = useNavigate();
    
    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">All Tasks</h1>
            </div>
            <div className="p-5 space-y-4">
                {tasks.map(t => (
                    <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold">{t.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{t.description}</p>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-bold">৳{t.amount}</span>
                    </div>
                ))}
            </div>
        </UserLayout>
    );
};

export const NotificationsPage: React.FC = () => {
    const { notifications, markNotificationsRead } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        markNotificationsRead();
    }, []);

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
            </div>
            <div className="p-5 space-y-3">
                {notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-xl border ${n.type === 'INCOME' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <h4 className="font-bold text-sm text-gray-800">{n.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(n.date).toLocaleDateString()}</p>
                    </div>
                ))}
                {notifications.length === 0 && <p className="text-center text-gray-400 py-10">No notifications.</p>}
            </div>
        </UserLayout>
    );
};

export const IncomeHistoryPage: React.FC = () => {
    const { incomeLogs } = useStore();
    const navigate = useNavigate();

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Income History</h1>
            </div>
            <div className="p-5 space-y-3">
                {incomeLogs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                         <div>
                             <p className="font-bold text-sm text-gray-800">{log.source}</p>
                             <p className="text-[10px] text-gray-400">{new Date(log.date).toLocaleDateString()}</p>
                         </div>
                         <span className="text-emerald-600 font-bold">+৳{log.amount}</span>
                    </div>
                ))}
                {incomeLogs.length === 0 && <p className="text-center text-gray-400 py-10">No history found.</p>}
            </div>
        </UserLayout>
    );
};

export const WorkVideoPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Work Videos</h1>
            </div>
            <div className="p-5">
                 <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center text-white">
                     <PlayCircle size={48} />
                 </div>
                 <h3 className="font-bold mt-4 text-gray-800">How to work?</h3>
                 <p className="text-xs text-gray-500">Watch this tutorial to learn how to earn money.</p>
            </div>
        </UserLayout>
    );
};

export const JobWithdrawPage: React.FC = () => {
    const { currentUser, submitJobWithdraw, jobWithdrawals } = useStore();
    const navigate = useNavigate();
    const [points, setPoints] = useState('');
    const [wallet, setWallet] = useState('');
    const { showToast } = useToast();

    const handleSubmit = () => {
        const p = Number(points);
        if(!p || !wallet) return showToast("Invalid Inputs", 'error');
        
        submitJobWithdraw({
            id: Date.now().toString(),
            userId: currentUser!.id,
            jobType: 'Data Entry',
            points: p,
            amountBDT: p * 0.1,
            walletNumber: wallet,
            proofImage: '',
            details: 'Job Withdraw',
            status: 'PENDING',
            date: new Date().toISOString()
        });
        showToast("Withdraw Submitted", 'success');
        setPoints('');
    };

    return (
        <UserLayout>
             <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/home')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Job Withdraw</h1>
            </div>
            <div className="p-5 space-y-4">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <input type="number" placeholder="Points" value={points} onChange={e => setPoints(e.target.value)} className="w-full p-3 border rounded-xl mb-3"/>
                     <input type="text" placeholder="Wallet Number" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full p-3 border rounded-xl mb-3"/>
                     <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Withdraw Points</button>
                 </div>
                 
                 <div className="space-y-3">
                     <h3 className="font-bold text-gray-700">History</h3>
                     {jobWithdrawals.map(jw => (
                         <div key={jw.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between">
                             <div>
                                 <p className="font-bold text-sm">Points: {jw.points}</p>
                                 <p className="text-xs text-gray-500">{jw.date}</p>
                             </div>
                             <span className={`text-xs font-bold px-2 py-1 rounded h-fit ${jw.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{jw.status}</span>
                         </div>
                     ))}
                 </div>
            </div>
        </UserLayout>
    );
};

export const PremiumFormPage: React.FC = () => {
    const { settings, currentUser, requestPremium } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [form, setForm] = useState({ method: 'BKASH', sender: '', trx: '' });

    const handleSubmit = () => {
        if(!form.sender || !form.trx) return showToast("Fill all fields", 'error');
        
        requestPremium({
            id: Date.now().toString(),
            userId: currentUser!.id,
            method: form.method,
            senderNumber: form.sender,
            trxId: form.trx,
            amount: settings.premiumCost,
            status: 'PENDING',
            date: new Date().toISOString()
        });
        showToast("Request Sent", 'success');
        navigate('/user/premium');
    };

    return (
        <UserLayout>
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/user/premium')} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-800"/></button>
                <h1 className="text-lg font-bold text-gray-800">Upgrade Premium</h1>
            </div>
            <div className="p-5">
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-100 mb-6 text-center">
                     <p className="text-sm font-bold text-gray-500 uppercase">Send Money To</p>
                     <h2 className="text-2xl font-black text-gray-900 my-2">{settings.contactNumber}</h2>
                     <p className="text-emerald-600 font-bold">Amount: ৳{settings.premiumCost}</p>
                 </div>

                 <div className="space-y-4">
                     <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} className="w-full p-4 border rounded-xl bg-white">
                         <option value="BKASH">Bkash</option>
                         <option value="NAGAD">Nagad</option>
                         <option value="ROCKET">Rocket</option>
                     </select>
                     <input type="text" placeholder="Sender Number" value={form.sender} onChange={e => setForm({...form, sender: e.target.value})} className="w-full p-4 border rounded-xl"/>
                     <input type="text" placeholder="Transaction ID" value={form.trx} onChange={e => setForm({...form, trx: e.target.value})} className="w-full p-4 border rounded-xl"/>
                     <button onClick={handleSubmit} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg">Submit Payment</button>
                 </div>
            </div>
        </UserLayout>
    );
};
