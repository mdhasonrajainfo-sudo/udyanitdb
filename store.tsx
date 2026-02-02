
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, TaskSubmission, Withdrawal, Ticket, Settings, UserStatus, PremiumRequest, Notification, JobWithdrawal, IncomeLog } from './types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  submissions: TaskSubmission[];
  withdrawals: Withdrawal[];
  jobWithdrawals: JobWithdrawal[];
  incomeLogs: IncomeLog[];
  tickets: Ticket[];
  premiumRequests: PremiumRequest[];
  notifications: Notification[];
  settings: Settings;
  unreadCount: number;
  
  // Actions
  login: (phone: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  submitTask: (submission: TaskSubmission) => void;
  approveTask: (submissionId: string) => void;
  rejectTask: (submissionId: string) => void;
  requestWithdraw: (withdrawal: Withdrawal) => void;
  approveWithdraw: (withdrawalId: string) => void;
  rejectWithdraw: (withdrawalId: string) => void;
  submitJobWithdraw: (jw: JobWithdrawal) => void;
  requestPremium: (req: PremiumRequest) => void;
  approvePremium: (reqId: string) => void;
  rejectPremium: (reqId: string) => void;
  markNotificationsRead: () => void;
  toggleDarkMode: () => void;
  
  // Admin Actions
  isAdmin: boolean;
  adminLogin: (phone: string, pass: string) => boolean;
  updateSettings: (s: Settings) => void;
  submitTicket: (t: Ticket) => void;
  addNotification: (n: Notification) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- INITIAL SETTINGS ---

const INITIAL_SETTINGS: Settings = {
  companyName: "UdyanIT",
  notice: "আমাদের অ্যাপে স্বাগতম! রেফার করে এবং টাস্ক কমপ্লিট করে আনলিমিটেড ইনকাম করুন।",
  landingText: "বিশ্বস্ত ইনকাম সোর্স, ১০০% পেমেন্ট গ্যারান্টি।",
  youtubeLink: "https://youtube.com",
  facebookLink: "https://facebook.com",
  telegramLink: "https://t.me",
  whatsappLink: "https://wa.me/01700000000",
  premiumCost: 500,
  refBonus: 50,
  contactNumber: "01700000000",
  quizReward: 1,
  jobPointRate: 0.10, // 1 point = 0.10 taka
  darkMode: false,
  privacyPolicy: "We value your privacy. All your data is secure with us. We do not share your personal information with third parties.\n\n1. Data Collection: We collect basic user info.\n2. Payments: Payments are processed manually within 24 hours.\n3. Termination: We reserve the right to ban users for fraudulent activities.",
  
  regBonus: 10,
  isPremiumActive: true,
  dailyFreeTaskLimit: 5,
  dailyPremiumTaskLimit: 20,
  isTaskSystemActive: true,
  gmailRate: 5,
  facebookRate: 15,
  instagramRate: 10,
  tiktokRate: 10,
  premiumGroupLink1: "https://t.me/group1",
  premiumGroupLink2: "https://t.me/group2",
  premiumGroupLink3: "https://t.me/group3",
  supportNumber: "01700000000",
  sliderImages: [
      "https://picsum.photos/600/300?random=1",
      "https://picsum.photos/600/300?random=2",
      "https://picsum.photos/600/300?random=3",
      "https://picsum.photos/600/300?random=4"
  ]
};

// --- DEMO ADMIN USER ---
// Note: Admin RefCode set to '123456' as per instructions for default fallback
const ADMIN_USER: User = {
    id: 'admin_master',
    name: 'Super Admin',
    phone: '01772209016',
    email: 'admin@udyanit.com',
    password: '123456',
    refCode: '123456', 
    uplineCode: '',
    status: UserStatus.PREMIUM,
    balanceFree: 10000,
    balancePremium: 50000,
    joinDate: '2023-01-01',
    isBlocked: false,
    refBonusReceived: 0,
    quizBalance: 100,
    withdrawCount: 0,
    totalWithdraw: 0,
    todayIncome: 0,
    totalIncome: 60000,
    profilePic: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or use ADMIN_USER as default if empty
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('app_users');
      if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          // Ensure Admin exists and has correct refCode
          const existingAdmin = parsed.find((u: User) => u.phone === '01772209016');
          if (!existingAdmin) {
              return [ADMIN_USER, ...parsed];
          } else if (existingAdmin.refCode !== '123456') {
              // Fix admin ref code if it was different previously
              const fixedUsers = parsed.map((u: User) => u.phone === '01772209016' ? ADMIN_USER : u);
              return fixedUsers;
          }
          return parsed;
      }
      return [ADMIN_USER];
    } catch (e) {
      return [ADMIN_USER];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('app_currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [jobWithdrawals, setJobWithdrawals] = useState<JobWithdrawal[]>([]);
  const [incomeLogs, setIncomeLogs] = useState<IncomeLog[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('app_users', JSON.stringify(newUsers));
  };

  const addNotification = (n: Notification) => setNotifications(prev => [n, ...prev]);

  const login = async (phone: string, pass: string) => {
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (user) {
      if (user.isBlocked) {
        alert("Account is Blocked. Contact Admin.");
        return false;
      }
      setCurrentUser(user);
      localStorage.setItem('app_currentUser', JSON.stringify(user));
      
      // Auto Notification on Login
      addNotification({
          id: Date.now().toString(),
          userId: user.id,
          title: 'Welcome Back!',
          message: `Successfully logged in at ${new Date().toLocaleTimeString()}`,
          type: 'SYSTEM',
          date: new Date().toISOString(),
          isRead: false
      });
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
      alert("Error: Phone number already registered!");
      return false;
    }
    
    // Strict Referral Check
    if (!data.refCode) {
        alert("Error: Referral Code is REQUIRED.");
        return false;
    }

    const upline = users.find(u => u.refCode === data.refCode);
    
    if (!upline) {
      alert("Error: Invalid Referral Code. Please enter a valid code (e.g., 123456 for Admin).");
      return false;
    }

    // New User
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      balanceFree: settings.regBonus,
      balancePremium: 0,
      status: UserStatus.FREE,
      joinDate: new Date().toISOString().split('T')[0],
      isBlocked: false,
      refBonusReceived: 0,
      withdrawCount: 0,
      totalWithdraw: 0,
      todayIncome: 0,
      totalIncome: 0,
      refCode: Math.floor(100000 + Math.random() * 900000).toString(),
      profilePic: '',
      quizBalance: 2,
      uplineCode: data.refCode
    };

    let updatedUsers = [...users, newUser];

    // Give Bonus Quiz to Upline
    if (upline) {
        const updatedUpline = { ...upline, quizBalance: (upline.quizBalance || 0) + 2 };
        updatedUsers = updatedUsers.map(u => u.id === upline.id ? updatedUpline : u);
        // Notify Upline
        addNotification({
            id: Date.now().toString(),
            userId: upline.id,
            title: 'New Referral',
            message: `New user ${newUser.name} joined using your code. You got 2 Quizzes!`,
            type: 'INCOME',
            date: new Date().toISOString(),
            isRead: false
        });
    }

    saveUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('app_currentUser', JSON.stringify(newUser));

    // Welcome Notification
    addNotification({
        id: Date.now().toString(),
        userId: newUser.id,
        title: 'Welcome to UdyanIT',
        message: 'Registration successful! Start earning by completing tasks.',
        type: 'SYSTEM',
        date: new Date().toISOString(),
        isRead: false
    });

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('app_currentUser');
  };

  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(newUsers);
    
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('app_currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
      const newUsers = users.filter(u => u.id !== userId);
      saveUsers(newUsers);
  }

  const requestPremium = (req: PremiumRequest) => {
      setPremiumRequests([req, ...premiumRequests]);
      addNotification({
          id: Date.now().toString(),
          userId: req.userId,
          title: 'Premium Request Sent',
          message: 'Please wait for admin approval.',
          type: 'SYSTEM',
          date: new Date().toISOString(),
          isRead: false
      });
  };

  const approvePremium = (reqId: string) => {
    const req = premiumRequests.find(r => r.id === reqId);
    if(req && req.status === 'PENDING') {
        const updatedReq = { ...req, status: 'APPROVED' as const };
        setPremiumRequests(premiumRequests.map(r => r.id === reqId ? updatedReq : r));
        
        const user = users.find(u => u.id === req.userId);
        if(user) {
            const updatedUser = { ...user, status: UserStatus.PREMIUM };
            
            const upline = users.find(u => u.refCode === user.uplineCode);
            let newUsers = [...users];

            if(upline) {
                const updatedUpline = { 
                    ...upline, 
                    balancePremium: upline.balancePremium + settings.refBonus, 
                    todayIncome: upline.todayIncome + settings.refBonus,
                    totalIncome: upline.totalIncome + settings.refBonus,
                    refBonusReceived: upline.refBonusReceived + settings.refBonus
                };
                newUsers = newUsers.map(u => u.id === upline.id ? updatedUpline : u);
                setIncomeLogs(prev => [...prev, { id: Date.now().toString(), userId: upline.id, amount: settings.refBonus, source: 'Premium Referral Bonus', date: new Date().toISOString() }]);
            }

            newUsers = newUsers.map(u => u.id === user.id ? updatedUser : u);
            saveUsers(newUsers);

            if (currentUser?.id === user.id) {
                setCurrentUser(updatedUser);
                localStorage.setItem('app_currentUser', JSON.stringify(updatedUser));
            }
            
            // Notify User
            addNotification({
                id: Date.now().toString(),
                userId: user.id,
                title: 'Premium Approved',
                message: 'Congratulations! You are now a Premium Member.',
                type: 'SYSTEM',
                date: new Date().toISOString(),
                isRead: false
            });
        }
    }
  };

  const rejectPremium = (reqId: string) => {
      const req = premiumRequests.find(r => r.id === reqId);
      setPremiumRequests(premiumRequests.map(r => r.id === reqId ? { ...r, status: 'REJECTED' } : r));
      if(req) {
          addNotification({
                id: Date.now().toString(),
                userId: req.userId,
                title: 'Premium Rejected',
                message: 'Your premium request was rejected. Contact support.',
                type: 'SYSTEM',
                date: new Date().toISOString(),
                isRead: false
            });
      }
  };

  const submitTask = (submission: TaskSubmission) => {
    setSubmissions([submission, ...submissions]);
    addNotification({
        id: Date.now().toString(),
        userId: submission.userId,
        title: 'Task Submitted',
        message: `Task "${submission.taskTitle}" submitted for review.`,
        type: 'SYSTEM',
        date: new Date().toISOString(),
        isRead: false
    });
  };

  const approveTask = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (sub && sub.status === 'PENDING') {
      const updatedSub = { ...sub, status: 'APPROVED' as const };
      setSubmissions(submissions.map(s => s.id === submissionId ? updatedSub : s));

      const user = users.find(u => u.id === sub.userId);
      if (user) {
        const isPremiumTask = tasks.find(t => t.id === sub.taskId)?.type === 'PREMIUM';
        const updatedUser = {
          ...user,
          balanceFree: isPremiumTask ? user.balanceFree : user.balanceFree + sub.amount,
          balancePremium: isPremiumTask ? user.balancePremium + sub.amount : user.balancePremium,
          todayIncome: user.todayIncome + sub.amount,
          totalIncome: user.totalIncome + sub.amount
        };
        updateUser(updatedUser);
        
        addNotification({
            id: Date.now().toString(),
            userId: user.id,
            title: 'Task Approved',
            message: `You earned ৳${sub.amount} from task.`,
            type: 'INCOME',
            date: new Date().toISOString(),
            isRead: false
        });
        setIncomeLogs(prev => [...prev, { id: Date.now().toString(), userId: user.id, amount: sub.amount, source: `Task: ${sub.taskTitle || 'Job'}`, date: new Date().toISOString() }]);
      }
    }
  };

  const rejectTask = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, status: 'REJECTED' } : s));
    if(sub) {
        addNotification({
            id: Date.now().toString(),
            userId: sub.userId,
            title: 'Task Rejected',
            message: `Task "${sub.taskTitle}" was rejected. Check details.`,
            type: 'SYSTEM',
            date: new Date().toISOString(),
            isRead: false
        });
    }
  };

  const requestWithdraw = (withdrawal: Withdrawal) => {
    setWithdrawals([withdrawal, ...withdrawals]);
    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
        const updatedUser = {
            ...user,
            balanceFree: withdrawal.type === 'FREE_WALLET' ? user.balanceFree - withdrawal.amount : user.balanceFree,
            balancePremium: withdrawal.type === 'PREMIUM_WALLET' ? user.balancePremium - withdrawal.amount : user.balancePremium
        };
        updateUser(updatedUser);
        addNotification({
            id: Date.now().toString(),
            userId: user.id,
            title: 'Withdrawal Pending',
            message: `Withdrawal of ৳${withdrawal.amount} requested.`,
            type: 'SYSTEM',
            date: new Date().toISOString(),
            isRead: false
        });
    }
  };

  const approveWithdraw = (withdrawalId: string) => {
      const w = withdrawals.find(wd => wd.id === withdrawalId);
      if(w) {
          setWithdrawals(withdrawals.map(wd => wd.id === withdrawalId ? { ...wd, status: 'APPROVED' } : wd));
          const user = users.find(u => u.id === w.userId);
          if(user) {
              const updatedUser = {
                  ...user,
                  withdrawCount: user.withdrawCount + 1,
                  totalWithdraw: user.totalWithdraw + w.amount,
              };
              updateUser(updatedUser);
              addNotification({
                id: Date.now().toString(),
                userId: user.id,
                title: 'Withdrawal Approved',
                message: `Your withdrawal of ৳${w.amount} has been sent.`,
                type: 'INCOME',
                date: new Date().toISOString(),
                isRead: false
            });
          }
      }
  };

  const rejectWithdraw = (withdrawalId: string) => {
      const w = withdrawals.find(wd => wd.id === withdrawalId);
      if (w) {
        setWithdrawals(withdrawals.map(wd => wd.id === withdrawalId ? { ...wd, status: 'REJECTED' } : wd));
        const user = users.find(u => u.id === w.userId);
        if(user) {
            const updatedUser = {
                ...user,
                balanceFree: w.type === 'FREE_WALLET' ? user.balanceFree + w.amount : user.balanceFree,
                balancePremium: w.type === 'PREMIUM_WALLET' ? user.balancePremium + w.amount : user.balancePremium
            };
            updateUser(updatedUser);
            addNotification({
                id: Date.now().toString(),
                userId: user.id,
                title: 'Withdrawal Rejected',
                message: `Withdrawal of ৳${w.amount} rejected and refunded.`,
                type: 'SYSTEM',
                date: new Date().toISOString(),
                isRead: false
            });
        }
      }
  }

  const submitJobWithdraw = (jw: JobWithdrawal) => {
      setJobWithdrawals([jw, ...jobWithdrawals]);
      addNotification({
        id: Date.now().toString(),
        userId: jw.userId,
        title: 'Job Withdraw Sent',
        message: `Job withdrawal request for ${jw.points} points sent.`,
        type: 'SYSTEM',
        date: new Date().toISOString(),
        isRead: false
    });
  }

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const deleteTask = (taskId: string) => setTasks(tasks.filter(t => t.id !== taskId));
  
  const markNotificationsRead = () => {
      setNotifications(notifications.map(n => ({...n, isRead: true})));
  }

  const toggleDarkMode = () => {
      setSettings({...settings, darkMode: !settings.darkMode});
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <StoreContext.Provider value={{
      currentUser, users, tasks, submissions, withdrawals, jobWithdrawals, incomeLogs, tickets, premiumRequests, notifications, settings, isAdmin, unreadCount,
      login, register, logout, updateUser, deleteUser,
      addTask, deleteTask,
      submitTask, approveTask, rejectTask,
      requestWithdraw, approveWithdraw, rejectWithdraw, submitJobWithdraw,
      requestPremium, approvePremium, rejectPremium,
      submitTicket: (t) => setTickets([...tickets, t]),
      addNotification, markNotificationsRead, adminLogin, updateSettings: setSettings, toggleDarkMode
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
