
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, TaskSubmission, Withdrawal, Settings, UserStatus, PremiumRequest, Notification, JobWithdrawal, IncomeLog, SupportTicket } from './types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  submissions: TaskSubmission[];
  withdrawals: Withdrawal[];
  jobWithdrawals: JobWithdrawal[];
  incomeLogs: IncomeLog[];
  premiumRequests: PremiumRequest[];
  notifications: Notification[];
  tickets: SupportTicket[];
  settings: Settings;
  unreadCount: number;
  
  login: (phone: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  submitTask: (submission: TaskSubmission) => void;
  requestWithdraw: (withdrawal: Withdrawal) => void;
  submitJobWithdraw: (jw: JobWithdrawal) => void;
  requestPremium: (req: PremiumRequest) => void;
  markNotificationsRead: () => void;
  addLog: (log: IncomeLog) => void;
  submitTicket: (t: SupportTicket) => void;
  
  approvePremium: (id: string) => void;
  rejectPremium: (id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  approveWithdraw: (id: string) => void;
  rejectWithdraw: (id: string) => void;

  isAdmin: boolean;
  adminLogin: (phone: string, pass: string) => boolean;
  updateSettings: (s: Settings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_SETTINGS: Settings = {
  companyName: "UdyanIT",
  notice: "আমাদের প্লাটফর্মে আপনাকে স্বাগতম! নিয়মিত কাজ করুন এবং রেফার করে ইনকাম বাড়ান।",
  landingText: "বিশ্বস্ত ইনকাম সোর্স, ১০০% পেমেন্ট গ্যারান্টি।",
  youtubeLink: "https://youtube.com",
  facebookLink: "https://facebook.com",
  telegramLink: "https://t.me",
  whatsappLink: "https://wa.me/017XXXXXXXX",
  premiumCost: 500,
  refBonus: 50,
  contactNumber: "017XXXXXXXX", 
  quizReward: 1,
  jobPointRate: 0.10,
  darkMode: false,
  privacyPolicy: "আপনার ডাটা আমাদের কাছে নিরাপদ।",
  regBonus: 10,
  isPremiumActive: true,
  dailyFreeTaskLimit: 5,
  dailyPremiumTaskLimit: 20,
  isTaskSystemActive: true,
  gmailRate: 5,
  facebookRate: 15,
  instagramRate: 10,
  tiktokRate: 10,
  supportNumber: "017XXXXXXXX",
  sliderImages: [
      "https://files.catbox.moe/v7r386.jpg",
      "https://files.catbox.moe/p99cwy.jpg",
      "https://files.catbox.moe/v7r386.jpg"
  ],
  premiumGroupLink1: "https://t.me/premium1",
  premiumGroupLink2: "https://t.me/premium2"
};

// Default Admin User to fix 123456 referral code issue
const DEFAULT_ADMIN: User = {
    id: 'admin-main',
    name: 'Admin Boss',
    phone: '01772209016',
    email: 'admin@app.com',
    password: 'admin',
    refCode: '123456',
    uplineCode: '',
    status: 'PREMIUM',
    balanceFree: 0,
    balancePremium: 0,
    balanceDeposit: 0,
    joinDate: '2024-01-01',
    isBlocked: false,
    refBonusReceived: 0,
    quizBalance: 100,
    withdrawCount: 0,
    totalWithdraw: 0,
    todayIncome: 0,
    totalIncome: 0,
    totalReferralIncome: 0,
    totalGmailSells: 0,
    totalTypingJobs: 0,
    totalRecharges: 0,
    todayTypingIncome: 0,
    totalTypingIncome: 0
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    const parsed = saved ? JSON.parse(saved) : [];
    // Ensure admin user exists for 123456 referral
    if (!parsed.find((u: User) => u.refCode === '123456')) {
        return [DEFAULT_ADMIN, ...parsed];
    }
    return parsed;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [jobWithdrawals, setJobWithdrawals] = useState<JobWithdrawal[]>([]);
  const [incomeLogs, setIncomeLogs] = useState<IncomeLog[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  const login = async (phone: string, pass: string) => {
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (user && !user.isBlocked) {
      setCurrentUser(user);
      localStorage.setItem('app_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogin = (phone: string, pass: string) => {
    if (phone === "01772209016" && pass === "123456") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const register = async (data: any) => {
    if (users.find(u => u.phone === data.phone)) {
        alert("Phone already registered!");
        return false;
    }
    const upline = users.find(u => u.refCode === data.refCode);
    if (!upline) {
        alert("Invalid Referral Code! Use 123456 as default.");
        return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      balanceFree: settings.regBonus,
      balancePremium: 0,
      balanceDeposit: 0,
      status: 'FREE', 
      joinDate: new Date().toISOString().split('T')[0],
      isBlocked: false,
      refBonusReceived: 0,
      withdrawCount: 0,
      totalWithdraw: 0,
      todayIncome: 0,
      totalIncome: settings.regBonus,
      totalReferralIncome: 0,
      totalGmailSells: 0,
      totalTypingJobs: 0,
      totalRecharges: 0,
      todayTypingIncome: 0,
      totalTypingIncome: 0,
      refCode: Math.floor(100000 + Math.random() * 900000).toString(),
      quizBalance: 2,
      uplineCode: data.refCode
    };

    setUsers(prev => prev.map(u => 
        u.id === upline.id ? { ...u, quizBalance: (u.quizBalance || 0) + 2 } : u
    ).concat(newUser));
    
    setCurrentUser(newUser);
    localStorage.setItem('app_currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('app_currentUser');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('app_currentUser', JSON.stringify(updatedUser));
    }
  };

  const submitTask = (sub: TaskSubmission) => setSubmissions(prev => [sub, ...prev]);
  const requestWithdraw = (w: Withdrawal) => setWithdrawals(prev => [w, ...prev]);
  const submitJobWithdraw = (jw: JobWithdrawal) => setJobWithdrawals(prev => [jw, ...prev]);
  const requestPremium = (req: PremiumRequest) => setPremiumRequests(prev => [req, ...prev]);
  const addLog = (log: IncomeLog) => setIncomeLogs(prev => [log, ...prev]);
  const submitTicket = (t: SupportTicket) => setTickets(prev => [t, ...prev]);

  const approvePremium = (id: string) => {
    const req = premiumRequests.find(r => r.id === id);
    if (!req) return;
    setPremiumRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    const user = users.find(u => u.id === req.userId);
    if (user) {
      updateUser({ ...user, status: 'PREMIUM' });
    }
  };

  const rejectPremium = (id: string) => {
    setPremiumRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const addTask = (task: Task) => setTasks(prev => [task, ...prev]);
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const approveTask = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    const user = users.find(u => u.id === sub.userId);
    if (user) {
      updateUser({ 
        ...user, 
        balanceFree: user.balanceFree + sub.amount,
        totalIncome: user.totalIncome + sub.amount 
      });
      addLog({
        id: Date.now().toString(),
        userId: user.id,
        amount: sub.amount,
        source: `Task Approved: ${sub.taskTitle || 'Bounty'}`,
        date: new Date().toISOString(),
        type: 'INCOME'
      });
    }
  };

  const rejectTask = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
  };

  const approveWithdraw = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const rejectWithdraw = (id: string) => {
    const w = withdrawals.find(withdraw => withdraw.id === id);
    if (!w) return;
    setWithdrawals(prev => prev.map(withdraw => withdraw.id === id ? { ...withdraw, status: 'REJECTED' } : withdraw));
    const user = users.find(u => u.id === w.userId);
    if (user) {
      if (w.type === 'FREE_WALLET') updateUser({ ...user, balanceFree: user.balanceFree + w.amount });
      else if (w.type === 'PREMIUM_WALLET') updateUser({ ...user, balancePremium: user.balancePremium + w.amount });
      else if (w.type === 'DEPOSIT_WALLET') updateUser({ ...user, balanceDeposit: user.balanceDeposit + w.amount });
    }
  };

  const markNotificationsRead = () => setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <StoreContext.Provider value={{
      currentUser, users, tasks, submissions, withdrawals, jobWithdrawals, incomeLogs, premiumRequests, notifications, tickets, settings, isAdmin, unreadCount,
      login, register, logout, updateUser, deleteUser: (id) => setUsers(prev => prev.filter(u => u.id !== id)),
      submitTask, requestWithdraw, submitJobWithdraw, requestPremium, addLog, submitTicket,
      approvePremium, rejectPremium, addTask, deleteTask, approveTask, rejectTask, approveWithdraw, rejectWithdraw,
      markNotificationsRead, adminLogin, updateSettings: setSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
