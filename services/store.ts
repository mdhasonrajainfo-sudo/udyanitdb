
import { User, Task, TaskSubmission, WithdrawRequest, AppSettings, PremiumRequest, SupportTicket, Notification, SocialSell, JobWithdrawRequest, VideoFolder, GmailOrder, CustomPage, Tool } from '../types';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://ikbjjhlbvqhzjrktdxgt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Zh3Wu8UyN6hBc5McYUoztQ_JaEHJpEt'; // Using the key provided

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- INITIAL DATA (Default Settings) ---
const INITIAL_SETTINGS: AppSettings = {
  companyName: "UdyanIT.com",
  companyLogo: "https://files.catbox.moe/mmesk9.jpg",
  founderName: "Md. Founder Name",
  landingDescription: "Welcome to UdyanIT, the most trusted platform for digital earnings.",
  noticeText: "Welcome to UdyanIT. Work carefully and earn money. We provide 100% payment guarantee.",
  privacyLink: "#",
  appDownloadLink: "https://play.google.com/store/apps", 
  supportConfig: {
    freeWhatsappGroupLink: "https://chat.whatsapp.com/free",
    freeTelegramChannelLink: "https://t.me/udyanit",
    freeTelegramGroupLink: "https://t.me/udyan_chat",
    premiumSupportGroupLink: "https://t.me/udyan_premium_group",
    premiumAdminWhatsapp: "01772209016",
    whatsappSupportLink: "https://wa.me/8801772209016",
    supportDescription: "আমাদের প্ল্যাটফর্মে কাজ করার জন্য আপনাকে স্বাগতম। যেকোনো সমস্যায় আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। ফ্রি ইউজাররা গ্রুপে জয়েন করুন এবং প্রিমিয়াম মেম্বাররা সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন।"
  },
  supportLink: "https://wa.me/8801772209016", 
  facebookGroupLink: "https://facebook.com/groups/udyanit",
  telegramLink: "https://t.me/udyanit",
  youtubeLink: "https://youtube.com",
  videoSessions: [],
  tutorialVideos: {
    workVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    gmailVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    withdrawVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  premiumFee: 500,
  premiumDescription: "Upgrade to Premium to unlock unlimited earnings.",
  paymentNumbers: { bkash: "01772209016", nagad: "01772209016", rocket: "01772209016" },
  sliderImages: ["https://picsum.photos/800/400?random=1", "https://picsum.photos/800/400?random=2"],
  socialSellConfig: {
    gmailRate: 5, fbRate: 10, instaRate: 8, tiktokRate: 8,
    isGmailOn: true, isFbOn: true, isInstaOn: true, isTiktokOn: true
  },
  planLimits: {
    freeAllowWithdraw: true, freeMaxWithdraw: 500, freeGmailLimit: 5, freeWalletMinWithdraw: 50,
    premiumMaxWithdraw: 10000, freeWithdrawFrequency: 2, isFreeWithdrawEnabled: true, isMainWithdrawEnabled: true,
    freeDailyTaskLimit: 20,
    premiumDailyTaskLimit: 100
  },
  referralConfig: {
    enabled: true, signupBonus: 2, quizRate: 1, level1Bonus: 100, quizAdLinks: ["https://google.com"], quizTimer: 30
  },
  withdrawRules: {
    MAIN: { minWithdraw: 100, feePercent: 2, enabled: true },
    FREE: { minWithdraw: 50, feePercent: 0, enabled: true },
  },
  messages: {
    premiumPopup: "Buy Premium!", withdrawMessage: "Withdraw Success.", freeJobInfo: "Free Info.", premiumBenefits: ["Lifetime Access", "Higher Rates", "Instant Withdraw"]
  },
  jobWithdrawMethods: [],
  customPages: [],
  tools: []
};

// --- LOCAL STORAGE STORE (Now Hybird with Supabase) ---
class LocalStore {
  users: User[] = [];
  tasks: Task[] = [];
  submissions: TaskSubmission[] = [];
  withdrawals: WithdrawRequest[] = [];
  socialSells: SocialSell[] = [];
  gmailOrders: GmailOrder[] = [];
  jobWithdrawRequests: JobWithdrawRequest[] = [];
  premiumRequests: PremiumRequest[] = [];
  supportTickets: SupportTicket[] = [];
  notifications: Notification[] = [];
  settings: AppSettings = INITIAL_SETTINGS;
  currentUser: User | null = null;
  
  private listeners: Function[] = [];
  private STORAGE_KEY = 'udyanit_db_v1';

  constructor() {
    this.loadLocal(); // Load from LocalStorage first for speed
    this.initSupabase(); // Then sync with Supabase
  }

  // --- SUPABASE INTEGRATION ---

  private async initSupabase() {
      try {
          // Parallel fetching for performance
          const [
              usersRes, tasksRes, subsRes, wRes, socRes, 
              gmRes, jobRes, premRes, tickRes, notifRes, setRes
          ] = await Promise.all([
              supabase.from('users').select('*'),
              supabase.from('tasks').select('*'),
              supabase.from('submissions').select('*'),
              supabase.from('withdrawals').select('*'),
              supabase.from('social_sells').select('*'),
              supabase.from('gmail_orders').select('*'),
              supabase.from('job_withdraw_requests').select('*'),
              supabase.from('premium_requests').select('*'),
              supabase.from('support_tickets').select('*'),
              supabase.from('notifications').select('*'),
              supabase.from('app_settings').select('*').limit(1)
          ]);

          if (usersRes.data) {
              this.users = usersRes.data;
              // CRITICAL: Ensure Admin exists in memory after fetch
              this.seedAdmin();
              
              // Validate Current Session: If database was wiped, logout user unless it's the seeded admin
              const sessionUser = localStorage.getItem('udyan_session_user');
              if (sessionUser) {
                  const exists = this.users.find(u => u.id === sessionUser);
                  if (exists) {
                      this.currentUser = exists;
                  } else {
                      // Database reset detected, user no longer exists
                      this.currentUser = null;
                      localStorage.removeItem('udyan_session_user');
                  }
              }
          }

          if (tasksRes.data) this.tasks = tasksRes.data;
          if (subsRes.data) this.submissions = subsRes.data;
          if (wRes.data) this.withdrawals = wRes.data;
          if (socRes.data) this.socialSells = socRes.data;
          if (gmRes.data) this.gmailOrders = gmRes.data;
          if (jobRes.data) this.jobWithdrawRequests = jobRes.data;
          if (premRes.data) this.premiumRequests = premRes.data;
          if (tickRes.data) this.supportTickets = tickRes.data;
          if (notifRes.data) this.notifications = notifRes.data;
          if (setRes.data && setRes.data.length > 0) {
              this.settings = { ...INITIAL_SETTINGS, ...setRes.data[0] }; 
          }

          this.saveLocal(); // Update local cache
          this.notifyListeners();

      } catch (error) {
          console.error("Supabase Sync Error:", error);
          this.seedAdmin();
      }
  }

  private async seedAdmin() {
      // Specific Admin Injection
      const adminPhone = '0145875542';
      const adminPass = '855#@#@Gfewghu';
      
      const existingAdminIndex = this.users.findIndex(u => u.whatsapp === adminPhone);

      const adminUser: User = {
        id: 'admin-auto-gen',
        name: 'Super Admin',
        whatsapp: adminPhone,
        email: 'admin@udyanit.com',
        password: adminPass,
        referralCode: '123456',
        accountType: 'PREMIUM',
        joiningDate: new Date().toISOString(),
        status: 'ACTIVE',
        isAdminAccess: true,
        balanceMain: 99999,
        balanceFree: 99999,
        pendingReferralBonus: 0,
        profileImage: 'https://ui-avatars.com/api/?name=Admin&background=0D9488&color=fff'
      };

      if (existingAdminIndex === -1) {
          this.users.push(adminUser);
          this.saveLocal();
          await supabase.from('users').insert(adminUser);
      } else {
          // Sync admin details if needed
          if (this.users[existingAdminIndex].password !== adminPass || !this.users[existingAdminIndex].isAdminAccess) {
              this.users[existingAdminIndex] = { ...this.users[existingAdminIndex], ...adminUser };
              this.saveLocal();
          }
      }
  }

  // --- LOCAL CACHE ---

  private saveLocal() {
    const data = {
      users: this.users,
      tasks: this.tasks,
      submissions: this.submissions,
      withdrawals: this.withdrawals,
      socialSells: this.socialSells,
      gmailOrders: this.gmailOrders,
      jobWithdrawRequests: this.jobWithdrawRequests,
      premiumRequests: this.premiumRequests,
      supportTickets: this.supportTickets,
      notifications: this.notifications,
      settings: this.settings
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  public save() {
      this.saveLocal();
      this.notifyListeners();
  }

  private loadLocal() {
    const dataStr = localStorage.getItem(this.STORAGE_KEY);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      this.users = data.users || [];
      this.tasks = data.tasks || [];
      this.submissions = data.submissions || [];
      this.withdrawals = data.withdrawals || [];
      this.socialSells = data.socialSells || [];
      this.gmailOrders = data.gmailOrders || [];
      this.jobWithdrawRequests = data.jobWithdrawRequests || [];
      this.premiumRequests = data.premiumRequests || [];
      this.supportTickets = data.supportTickets || [];
      this.notifications = data.notifications || [];
      this.settings = { ...INITIAL_SETTINGS, ...data.settings };
    }
    const sessionUser = localStorage.getItem('udyan_session_user');
    if(sessionUser) {
        const u = this.users.find(u => u.id === sessionUser);
        if(u) this.currentUser = u;
    }
  }

  subscribe(callback: Function) {
    this.listeners.push(callback);
    callback();
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  // --- ACTIONS ---

  async login(phone: string, pass: string): Promise<boolean> {
    if (phone === '0145875542') {
        this.seedAdmin();
    }

    let user = this.users.find(u => u.whatsapp === phone && u.password === pass);
    
    if (!user) {
        const { data } = await supabase.from('users').select('*').eq('whatsapp', phone).eq('password', pass).single();
        if (data) {
            user = data as User;
            if (!this.users.find(u => u.id === user!.id)) {
                this.users.push(user);
            }
        }
    }

    if (user) {
      if (user.status === 'BLOCKED') throw new Error("Account Blocked");
      this.currentUser = user;
      localStorage.setItem('udyan_session_user', user.id);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  async register(data: Partial<User>): Promise<User> {
    if (this.users.find(u => u.whatsapp === data.whatsapp)) throw new Error("Phone number already registered.");

    if (!data.referralCode) throw new Error("Referral Code is mandatory. Use '123456' if you don't have one.");
    
    let referrerId: string | undefined = undefined;
    
    if (data.referralCode === '123456') {
        referrerId = undefined; // Admin
    } else {
        const referrer = this.users.find(u => u.referralCode === data.referralCode);
        if (!referrer) throw new Error("Invalid Referral Code! You must enter a valid code.");
        referrerId = referrer.id;
    }

    const id = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newUser: User = {
      id,
      name: data.name!,
      whatsapp: data.whatsapp!,
      email: data.email!,
      password: data.password!,
      referralCode: Math.floor(100000 + Math.random() * 900000).toString(),
      referrerId: referrerId,
      accountType: 'FREE',
      joiningDate: new Date().toISOString(),
      status: 'ACTIVE',
      isAdminAccess: false,
      balanceMain: 0, 
      balanceFree: 5,
      pendingReferralBonus: 0,
      profileImage: `https://ui-avatars.com/api/?name=${data.name}&background=random`
    };

    const { error } = await supabase.from('users').insert(newUser);
    if(error) throw new Error(error.message);

    this.users.push(newUser);

    if (referrerId) {
       const referrerIndex = this.users.findIndex(u => u.id === referrerId);
       if(referrerIndex >= 0) {
           const currentPending = Number(this.users[referrerIndex].pendingReferralBonus) || 0;
           const bonus = Number(this.settings.referralConfig.signupBonus) || 0;
           const newPending = currentPending + bonus;
           
           this.users[referrerIndex].pendingReferralBonus = newPending;
           supabase.from('users').update({ pendingReferralBonus: newPending }).eq('id', referrerId);
       }
    }

    this.currentUser = newUser;
    localStorage.setItem('udyan_session_user', newUser.id);
    this.saveLocal();
    return newUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('udyan_session_user');
    this.notifyListeners();
  }

  getReferrer(code: string) {
    if (code === '123456') return { name: 'Official Admin (Default)' } as User;
    return this.users.find(u => u.referralCode === code);
  }

  getUpline(userId: string): User | undefined {
    const user = this.users.find(u => u.id === userId);
    if (!user || !user.referrerId) return undefined;
    return this.users.find(u => u.id === user.referrerId);
  }

  getDownline(userId: string): User[] {
    return this.users.filter(u => u.referrerId === userId);
  }

  getUnreadNotificationsCount(userId: string): number {
    return this.notifications.filter(n => !n.readBy.includes(userId)).length;
  }

  async updateUser(user: User) {
    const idx = this.users.findIndex(u => u.id === user.id);
    if(idx >= 0) {
        this.users[idx] = user;
        if(this.currentUser?.id === user.id) this.currentUser = user;
        this.saveLocal();
        await supabase.from('users').update(user).eq('id', user.id);
    }
  }

  async updateSettings(newSettings: AppSettings) {
    this.settings = newSettings;
    this.saveLocal();
    await supabase.from('app_settings').upsert({ id: 1, ...newSettings });
  }

  async addTask(task: Task) {
    this.tasks.push(task);
    this.saveLocal();
    await supabase.from('tasks').insert(task);
  }

  async deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveLocal();
    await supabase.from('tasks').delete().eq('id', id);
  }

  async submitTask(submission: TaskSubmission) {
    this.submissions.push(submission);
    this.saveLocal();
    await supabase.from('submissions').insert(submission);
  }

  async updateSubmission(id: string, data: Partial<TaskSubmission>) {
    const idx = this.submissions.findIndex(s => s.id === id);
    if(idx >= 0) {
        this.submissions[idx] = { ...this.submissions[idx], ...data };
        this.saveLocal();
        await supabase.from('submissions').update(data).eq('id', id);
    }
  }

  async requestWithdraw(req: WithdrawRequest) {
    this.withdrawals.push(req);
    this.saveLocal();
    await supabase.from('withdrawals').insert(req);
  }

  async updateWithdrawal(id: string, status: string) {
    const idx = this.withdrawals.findIndex(w => w.id === id);
    if(idx >= 0) {
        this.withdrawals[idx].status = status as any;
        this.saveLocal();
        await supabase.from('withdrawals').update({ status }).eq('id', id);
    }
  }

  async addSocialSell(sell: SocialSell) {
    this.socialSells.push(sell);
    this.saveLocal();
    await supabase.from('social_sells').insert(sell);
  }

  async updateSocialSell(id: string, status: string) {
    const idx = this.socialSells.findIndex(s => s.id === id);
    if(idx >= 0) {
        this.socialSells[idx].status = status as any;
        this.saveLocal();
        await supabase.from('social_sells').update({ status }).eq('id', id);
    }
  }

  async addPremiumRequest(req: PremiumRequest) {
    this.premiumRequests.push(req);
    this.saveLocal();
    await supabase.from('premium_requests').insert(req);
  }

  async updatePremiumRequest(id: string, status: string) {
    const idx = this.premiumRequests.findIndex(r => r.id === id);
    if(idx >= 0) {
        this.premiumRequests[idx].status = status as any;
        this.saveLocal();
        await supabase.from('premium_requests').update({ status }).eq('id', id);
    }
  }

  async addJobWithdraw(req: JobWithdrawRequest) {
    this.jobWithdrawRequests.push(req);
    this.saveLocal();
    await supabase.from('job_withdraw_requests').insert(req);
  }

  async updateJobWithdraw(id: string, status: string) {
    const idx = this.jobWithdrawRequests.findIndex(r => r.id === id);
    if(idx >= 0) {
        this.jobWithdrawRequests[idx].status = status as any;
        this.saveLocal();
        await supabase.from('job_withdraw_requests').update({ status }).eq('id', id);
    }
  }

  async addTicket(ticket: SupportTicket) {
    this.supportTickets.push(ticket);
    this.saveLocal();
    await supabase.from('support_tickets').insert(ticket);
  }

  async updateTicket(id: string, data: Partial<SupportTicket>) {
    const idx = this.supportTickets.findIndex(t => t.id === id);
    if(idx >= 0) {
        this.supportTickets[idx] = { ...this.supportTickets[idx], ...data };
        this.saveLocal();
        this.notifyListeners();
        await supabase.from('support_tickets').update(data).eq('id', id);
    }
  }
}

export const store = new LocalStore();
