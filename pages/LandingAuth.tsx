
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
// @ts-ignore
import * as RRD from 'react-router-dom';
const { useNavigate, useLocation } = RRD as any;

// @ts-ignore
import * as MotionModule from 'framer-motion';
const { motion, AnimatePresence } = MotionModule as any;

import { 
  Menu, X, Smartphone, UserPlus, FileText, CircleHelp, 
  Download, Youtube, Facebook, MessageCircle, ArrowRight, ArrowLeft,
  Lock, PlayCircle, Star, Shield, CheckCircle, 
  Instagram, Phone, Video, Headphones, User, Globe, Users,
  Mail, Send, AlertCircle, Key
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { settings, currentUser } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const SocialIcon = ({ type }: { type: string }) => {
    switch(type) {
        case 'fb': return <Facebook className="w-5 h-5" />;
        case 'yt': return <Youtube className="w-5 h-5" />;
        case 'tg': return <MessageCircle className="w-5 h-5" />;
        case 'wa': return <Phone className="w-5 h-5" />;
        case 'ig': return <Instagram className="w-5 h-5" />;
        case 'tk': return <Video className="w-5 h-5" />;
        default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 relative overflow-hidden bg-white">
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/support')} className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-3.5 rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center"><Headphones size={22} /></motion.button>
      <div className="absolute inset-0 z-0 pointer-events-none"><div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50 to-transparent"></div></div>
      <div className="relative z-10 max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-2xl">
          <header className="flex justify-between items-center px-5 py-3 sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-50">
            <div className="flex items-center">
               <div className="flex items-center gap-2"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-8 h-8 object-contain" /><span className="font-black text-xl tracking-tighter flex items-center"><span className="text-emerald-600">Next</span><span className="text-gray-900">Level</span></span></div>
            </div>
            <div className="flex gap-2">
              {currentUser && (<button onClick={() => navigate('/user/home')} className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold">Dashboard</button>)}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 p-1.5 hover:bg-gray-50 rounded-lg transition">{isMenuOpen ? <X size={26} /> : <Menu size={26} />}</button>
            </div>
          </header>
          <AnimatePresence>
          {isMenuOpen && (
            <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"/><motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: "tween" }} className="fixed inset-y-0 right-0 w-72 bg-white z-50 p-6 flex flex-col gap-2 shadow-2xl pt-24 border-l border-gray-100">
                <button onClick={() => navigate('/login')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Smartphone size={18} className="text-emerald-600"/> Login</button>
                <button onClick={() => navigate('/register')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><UserPlus size={18} className="text-emerald-600"/> Registration</button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Download size={18} className="text-emerald-600"/> Download App</button>
                <button onClick={() => navigate('/support')} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl text-sm font-bold text-gray-700 transition"><Headphones size={18} className="text-emerald-600"/> Help & Support</button>
                </motion.div></>
          )}
          </AnimatePresence>
          <main className="flex-grow overflow-y-auto hide-scrollbar">
            <section className="px-5 pt-8 pb-4 text-center"><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6"><h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight">Earn Money <br/><span className="text-emerald-600">Every Single Day</span></h1><p className="text-gray-500 text-sm leading-relaxed px-2 font-medium">{settings.landingDescription} Join the largest earning community in Bangladesh. Guaranteed payment and 24/7 support.</p><div className="flex gap-3 w-full mt-8"><button onClick={() => navigate('/login')} className="flex-1 bg-gray-900 text-white py-4 rounded-xl shadow-lg shadow-gray-200 font-bold text-sm hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2"><Smartphone size={18} /> Login</button><button onClick={() => navigate('/register')} className="flex-1 bg-white text-emerald-600 border-2 border-emerald-500 py-4 rounded-xl shadow-sm font-bold text-sm hover:bg-emerald-50 transition active:scale-95 flex items-center justify-center gap-2"><UserPlus size={18} /> Register</button></div></motion.div>
                <div className="grid grid-cols-3 gap-2 mt-6 mb-8"><div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center"><Users size={20} className="text-blue-500 mb-1"/><h3 className="font-black text-gray-800 text-sm">50K+</h3><p className="text-[10px] text-gray-500 font-bold uppercase">Users</p></div><div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center"><CheckCircle size={20} className="text-emerald-500 mb-1"/><h3 className="font-black text-gray-800 text-sm">৳2.5Cr+</h3><p className="text-[10px] text-gray-500 font-bold uppercase">Paid</p></div><div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center"><Globe size={20} className="text-purple-500 mb-1"/><h3 className="font-black text-gray-800 text-sm">2K+</h3><p className="text-[10px] text-gray-500 font-bold uppercase">Online</p></div></div>
            </section>
            <section className="px-5 pb-8"><div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-xl text-left flex items-center justify-between"><div className="relative z-10 w-2/3"><div className="flex items-center gap-2 mb-2"><div className="bg-white p-1 rounded-lg"><img src="https://files.catbox.moe/oq7gs8.jpg" className="w-8 h-8 object-contain"/></div><span className="text-white font-bold tracking-wider text-sm">{settings.companyName}</span></div><h2 className="text-xl font-bold text-white leading-tight mb-4">Download Official App</h2><button className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 w-fit active:scale-95 transition"><Download size={16}/> Download APK</button></div><div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-sm flex items-center justify-center"><Smartphone size={64} className="text-white/20"/></div></div></section>
            <section className="px-5 pb-10"><div className="flex items-center justify-between mb-4"><h2 className="text-base font-black text-gray-800 uppercase tracking-wide border-l-4 border-emerald-500 pl-3">Earning Features</h2></div><div className="grid grid-cols-2 gap-3">{[{ title: "Daily Task", icon: CheckCircle, desc: "Easy Income", color: "text-blue-500", bg: "bg-blue-50" },{ title: "Watch Ads", icon: PlayCircle, desc: "Video Earn", color: "text-red-500", bg: "bg-red-50" },{ title: "Referral", icon: UserPlus, desc: "Invite Bonus", color: "text-purple-500", bg: "bg-purple-50" },{ title: "Premium", icon: Shield, desc: "VIP Plan", color: "text-yellow-500", bg: "bg-yellow-50" }].map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-3"><div className={`${item.bg} p-2.5 rounded-lg ${item.color}`}><item.icon size={20} /></div><div><h3 className="font-bold text-gray-800 text-xs">{item.title}</h3><p className="text-[10px] text-gray-400 font-medium">{item.desc}</p></div></div>))}</div></section>
            <footer className="bg-white p-6 text-center border-t border-gray-50"><p className="text-[10px] text-gray-400 font-medium">© 2024 {settings.companyName}. All rights reserved.</p></footer>
          </main>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { login, adminLogin, settings } = useStore();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); 
    
    // Updated Admin Login Detection: 01700000000 / 01700000000123456
    if(phone === '01700000000' && pass === '01700000000123456') {
        setIsLoading(false);
        setShowAdminAuth(true); 
        return;
    }

    const success = await login(phone, pass);
    setIsLoading(false);
    if (success) navigate('/user/home');
    else alert("Invalid Credentials");
  };

  const handleAdminVerify = (e: React.FormEvent) => {
      e.preventDefault();
      if(adminCode === '123456') {
          if(adminLogin(phone, pass)) navigate('/admin/dashboard');
      } else {
          alert("Wrong Security Code!");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto relative">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-gray-600"><ArrowRight size={20} className="rotate-180"/></button>
      <div className="flex justify-center mb-6"><div className="bg-white p-3 rounded-2xl shadow-sm"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-12 h-12 object-contain" /></div></div>
      <div className="mb-8 text-center"><h2 className="text-3xl font-black text-gray-800">Welcome Back</h2><p className="text-gray-400 mt-2 font-medium">Please sign in to {settings.companyName}</p></div>
      {!showAdminAuth ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={20} /></div><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900" placeholder="WhatsApp Number" required /></div>
            <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20} /></div><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900" placeholder="Password" required /></div>
            <div className="text-right"><button type="button" className="text-xs text-emerald-600 font-bold hover:underline">Forgot Password?</button></div>
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 text-lg hover:scale-[1.02] transition flex justify-center active:scale-95 items-center gap-2">{isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Smartphone size={20}/> Sign In</>}</button>
          </form>
      ) : (
          <form onSubmit={handleAdminVerify} className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center mb-4"><p className="text-yellow-800 font-bold text-sm">Admin Security Check</p><p className="text-xs text-yellow-600">Please enter the security code</p></div>
              <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Key size={20} /></div><input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-medium text-gray-900 text-center tracking-widest" placeholder="1-6 Code" required /></div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl text-lg hover:scale-[1.02] transition flex justify-center active:scale-95 items-center gap-2">Verify & Login</button>
              <button type="button" onClick={() => setShowAdminAuth(false)} className="w-full text-gray-500 text-sm font-bold hover:underline">Cancel</button>
          </form>
      )}
      <div className="mt-10 text-center"><p className="text-sm text-gray-500 font-medium">Don't have an account? <span onClick={() => navigate('/register')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Create Account</span></p></div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register, settings, users } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', refCode: '' });
  const [refName, setRefName] = useState<string | null>(null);
  const [isValidRef, setIsValidRef] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');
    if (refParam) setFormData(prev => ({ ...prev, refCode: refParam }));
  }, [location]);

  useEffect(() => {
      if(formData.refCode === '123456') { setRefName('Official Admin'); setIsValidRef(true); }
      else if(formData.refCode.length >= 6) {
          const matchedUser = users.find(u => u.referralCode === formData.refCode);
          if(matchedUser) { setRefName(matchedUser.name); setIsValidRef(true); }
          else { setRefName(null); setIsValidRef(false); }
      } else { setRefName(null); setIsValidRef(false); }
  }, [formData.refCode, users]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!isValidRef) return alert("Invalid Referral Code!");
    const success = await register(formData);
    if (success) { alert("Registration Successful!"); navigate('/user/home'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-8 max-w-md mx-auto relative">
       <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-gray-600"><ArrowRight size={20} className="rotate-180"/></button>
       <div className="flex justify-center mb-6"><div className="bg-white p-3 rounded-2xl shadow-sm"><img src="https://files.catbox.moe/oq7gs8.jpg" alt="Logo" className="w-12 h-12 object-contain" /></div></div>
       <div className="mb-8 text-center"><h2 className="text-3xl font-black text-gray-800">Create Account</h2><p className="text-gray-400 mt-2 font-medium">Join {settings.companyName} today</p></div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={20}/></div><input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={20}/></div><input type="text" placeholder="WhatsApp Number" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20}/></div><input type="email" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={20}/></div><input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 pl-12 border-none bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900" required /></div>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Users size={20}/></div><input type="text" placeholder="Referral Code (Required)" value={formData.refCode} onChange={e => setFormData({...formData, refCode: e.target.value})} className={`w-full p-4 pl-12 border-2 bg-white rounded-2xl shadow-sm outline-none font-medium text-gray-900 transition ${formData.refCode.length > 0 ? (isValidRef ? 'border-emerald-500' : 'border-red-500') : 'border-transparent'}`} required />{formData.refCode.length > 0 && (<div className="absolute right-4 top-1/2 -translate-y-1/2">{isValidRef ? <CheckCircle size={20} className="text-emerald-500"/> : <AlertCircle size={20} className="text-red-500"/>}</div>)}</div>
        {formData.refCode.length > 0 && (<div className={`text-center text-xs font-bold py-2 rounded-lg ${isValidRef ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{isValidRef ? `Referred by: ${refName}` : 'Invalid Referral Code'}</div>)}
        <button type="submit" disabled={!isValidRef} className={`w-full text-white py-4 rounded-2xl font-bold shadow-xl mt-4 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2 ${isValidRef ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}><UserPlus size={20}/> Sign Up</button>
      </form>
      <div className="mt-8 text-center"><p className="text-sm text-gray-500 font-medium">Already have an account? <span onClick={() => navigate('/login')} className="text-emerald-600 font-bold cursor-pointer hover:underline">Sign In</span></p></div>
    </div>
  );
};
