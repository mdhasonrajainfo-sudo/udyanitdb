
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  name: string;
  phone: string; // Used as ID
  email: string;
  password: string;
  refCode: string; // Numeric only now
  uplineCode: string; // Who referred them
  status: UserStatus;
  balanceFree: number;
  balancePremium: number;
  joinDate: string;
  isBlocked: boolean;
  refBonusReceived: number;
  quizBalance: number; // New: For Referral Quiz
  // New Stats
  withdrawCount: number; // To limit free users to 1 withdrawal
  totalWithdraw: number;
  todayIncome: number;
  totalIncome: number;
  profilePic?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  amount: number;
  image: string;
  link: string;
  type: 'FREE' | 'PREMIUM';
  category: 'YOUTUBE' | 'FACEBOOK' | 'TIKTOK' | 'GMAIL' | 'INSTAGRAM' | 'OTHER';
  limitPerDay?: number;
}

export interface TaskSubmission {
  id: string;
  userId: string;
  taskId: string;
  proofLink: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  amount: number;
  taskTitle?: string;
  category?: string; // To filter in Social Management
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'BKASH' | 'NAGAD' | 'ROCKET';
  number: string;
  type: 'FREE_WALLET' | 'PREMIUM_WALLET';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface JobWithdrawal {
  id: string;
  userId: string;
  jobType: string;
  points: number;
  amountBDT: number;
  walletNumber: string; // User's whatsapp usually
  proofImage: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface IncomeLog {
  id: string;
  userId: string;
  amount: number;
  source: string; // 'Task', 'Referral', 'Bonus'
  date: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'CLOSED';
  date: string;
}

export interface PremiumRequest {
  id: string;
  userId: string;
  method: string;
  senderNumber: string;
  trxId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Notification {
  id: string;
  userId?: string; // If null, it's a global admin message
  title: string;
  message: string;
  type: 'ADMIN' | 'INCOME' | 'SYSTEM';
  date: string;
  isRead: boolean;
}

export interface Settings {
  companyName: string;
  notice: string;
  landingText: string;
  youtubeLink: string;
  facebookLink: string;
  telegramLink: string;
  whatsappLink: string;
  premiumCost: number;
  refBonus: number;
  contactNumber: string; // Used for payments
  quizReward: number;
  jobPointRate: number; 
  darkMode: boolean;
  privacyPolicy: string;
  
  // New Admin Settings
  regBonus: number;
  isPremiumActive: boolean;
  
  // Task Settings
  dailyFreeTaskLimit: number;
  dailyPremiumTaskLimit: number;
  isTaskSystemActive: boolean;

  // Social Rates
  gmailRate: number;
  facebookRate: number;
  instagramRate: number;
  tiktokRate: number;
  
  // Support Links
  premiumGroupLink1: string;
  premiumGroupLink2: string;
  premiumGroupLink3: string;
  supportNumber: string;

  // Images
  sliderImages: string[];
}
