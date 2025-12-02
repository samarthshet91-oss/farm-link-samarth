import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './services/store';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, MessageSquare, PlusCircle, Settings, LogOut, Loader2, Camera, Upload, Mic, Search, TrendingUp, Users, MapPin, IndianRupee, Wheat, ShoppingBag, CheckCircle, CreditCard, Banknote, Truck, ArrowLeft, ShieldCheck, BarChart3, Globe, Smartphone, Package, Clock, Box, User as UserIcon, Save } from 'lucide-react';
import { analyzeCropImage, matchOpportunities, predictPrice, isAiAvailable } from './services/gemini';
import { Chat } from './components/Chat';
import { OrderStatus, Order } from './types';

// --- Shared Components ---

const Logo = ({ size = "medium", variant = "color" }: { size?: "small" | "medium" | "large", variant?: "color" | "white" }) => {
  const heightClass = size === 'large' ? 'h-24 w-24' : size === 'medium' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'large' ? 'text-5xl' : size === 'medium' ? 'text-xl' : 'text-lg';

  // Custom SVG based on the provided logo image (Rounded Frame, Barn, Wheat)
  const LogoSVG = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <linearGradient id="barnGradient" x1="100" y1="50" x2="100" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor={variant === 'white' ? '#ffffff' : '#10b981'} />
            <stop offset="1" stopColor={variant === 'white' ? '#e2e8f0' : '#047857'} />
         </linearGradient>
      </defs>
      
      {/* Phone/App Frame */}
      <rect x="40" y="20" width="120" height="160" rx="25" stroke={variant === 'white' ? 'currentColor' : '#059669'} strokeWidth="12" fill={variant === 'white' ? 'none' : '#ecfdf5'} />
      <path d="M85 20 V32 H115 V20" stroke={variant === 'white' ? 'currentColor' : '#059669'} strokeWidth="8" strokeLinecap="round" />

      {/* Barn / House */}
      <path d="M105 90 L145 90 V145 H105 V90 Z" fill="url(#barnGradient)" />
      <path d="M100 90 L125 65 L150 90 H100 Z" fill="url(#barnGradient)" />
      <rect x="118" y="115" width="14" height="30" fill={variant === 'white' ? '#064e3b' : '#ffffff'} fillOpacity="0.8" /> 

      {/* Wheat Stalk */}
      <path d="M75 145 Q 65 100 85 60" stroke={variant === 'white' ? 'currentColor' : '#d97706'} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="65" cy="85" rx="8" ry="14" transform="rotate(-30 65 85)" fill={variant === 'white' ? 'currentColor' : '#fbbf24'} />
      <ellipse cx="65" cy="110" rx="8" ry="14" transform="rotate(-30 65 110)" fill={variant === 'white' ? 'currentColor' : '#fbbf24'} />
      <ellipse cx="85" cy="55" rx="6" ry="10" transform="rotate(10 85 55)" fill={variant === 'white' ? 'currentColor' : '#fbbf24'} />

      {/* Fields */}
      <path d="M55 155 Q 100 135 145 155" stroke={variant === 'white' ? 'currentColor' : '#10b981'} strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );

  return (
    <div className={`flex items-center gap-3 select-none ${variant === 'white' ? 'text-white' : 'text-slate-800'}`}>
      <div className={`${heightClass} transition-transform hover:scale-105 duration-300`}>
        <LogoSVG />
      </div>
      <div className={`font-bold tracking-tight flex flex-col leading-none justify-center ${textSize}`}>
        <span className={variant === 'white' ? 'text-white' : 'text-slate-700'}>FARM</span>
        <span className={variant === 'white' ? 'text-emerald-300' : 'text-emerald-600'}>LINK</span>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition p-2">
          <Logo size="medium" variant="color" />
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-2 font-medium" title="Dashboard">
                  <LayoutDashboard size={20}/> <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <Link to="/orders" className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-2 font-medium" title="Orders">
                  <Package size={20}/> <span className="hidden lg:inline">Orders</span>
                </Link>
                {user.role === 'farmer' && (
                  <Link to="/produces" className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-2 font-medium" title="Market">
                    <Wheat size={20}/> <span className="hidden lg:inline">Market</span>
                  </Link>
                )}
                <Link to="/chat" className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-2 font-medium" title="Messages">
                  <MessageSquare size={20}/> <span className="hidden lg:inline">Chat</span>
                </Link>
                <Link to="/profile" className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-2 font-medium" title="Profile">
                  <UserIcon size={20}/> <span className="hidden lg:inline">Profile</span>
                </Link>
              </div>
              <div className="flex items-center ml-2 pl-4 border-l border-slate-200">
                <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition text-sm font-medium" title="Sign Out">
                  <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition">Log In</Link>
              <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-medium transition shadow-md shadow-emerald-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, roles }: { children?: React.ReactNode, roles?: string[] }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

// --- Landing Page ---

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="mb-10 transform hover:scale-105 transition duration-500">
             <Logo size="large" variant="white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Cultivating Connections <br/>
            <span className="text-emerald-300">Growing Together</span>
          </h1>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            The intelligent marketplace connecting farmers directly with buyers. Fair prices, fresh produce, and powerful AI insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button onClick={() => navigate('/signup')} className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 flex-1">
              Get Started <ArrowLeft className="rotate-180" size={20}/>
            </button>
            <button onClick={() => navigate('/login')} className="bg-white/10 backdrop-blur-sm border-2 border-emerald-500/30 text-emerald-50 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2 flex-1">
              <Users size={20}/> Log In
            </button>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose FarmLink?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We bridge the gap between harvest and home with technology that empowers everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Smartphone size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Access</h3>
            <p className="text-slate-500 leading-relaxed">Buy and sell directly using your phone. No complicated processes, just simple connections.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Price Insights</h3>
            <p className="text-slate-500 leading-relaxed">Get real-time price predictions and market trends to maximize your profits.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Globe size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Nationwide Network</h3>
            <p className="text-slate-500 leading-relaxed">Access a vast network of verified farmers and buyers across the country.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Auth Views ---

const AuthPage = () => {
  const { login, signup } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');

  // Reset form when switching modes
  useEffect(() => {
    setName('');
    setIdentifier('');
    setPassword('');
  }, [isSignup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (name.trim().length < 2) {
        alert("Please enter your name");
        return;
      }
      signup(name, identifier, password, role);
      navigate('/dashboard');
    } else {
      const success = login(identifier, password, role);
      if (success) {
        navigate('/dashboard');
      } else {
        alert("Login failed! Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-emerald-900 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0"></div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center text-slate-400 hover:text-slate-800 transition text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-1"/> Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
             <Logo size="large" variant="color" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500 text-sm mt-2">
            {isSignup ? 'Join the community today' : 'Sign in to access your dashboard'}
          </p>
        </div>
        
        {/* Demo Credentials Hint */}
        {!isSignup && (
          <div className="mb-6 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-600 space-y-2">
             <p className="font-bold text-slate-800 flex items-center gap-1"><ShieldCheck size={12}/> Demo Credentials:</p>
             <div className="grid grid-cols-2 gap-2">
               <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="block font-bold text-emerald-700">Farmer</span>
                  <span className="font-mono text-[10px]">john@farm.com</span>
                  <span className="block font-mono text-[10px] text-slate-400">pass: 123</span>
               </div>
               <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="block font-bold text-blue-700">Buyer</span>
                  <span className="font-mono text-[10px]">buyer@market.com</span>
                  <span className="block font-mono text-[10px] text-slate-400">pass: 123</span>
               </div>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
           {isSignup && (
             <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Smartphone size={16} /> Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ShoppingCart size={16} /> Buyer
                </button>
             </div>
           )}
           
           {isSignup && (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
               <input 
                 type="text" 
                 value={name} 
                 onChange={e => setName(e.target.value)} 
                 className="w-full bg-white text-slate-900 border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                 placeholder="Your Name"
                 required 
               />
             </div>
           )}

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Email or Phone</label>
             <input 
               type="text" 
               value={identifier} 
               onChange={e => setIdentifier(e.target.value)} 
               className="w-full bg-white text-slate-900 border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
               placeholder="john@farm.com"
               required 
             />
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white text-slate-900 border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                placeholder="••••••••"
                required 
              />
           </div>

           <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-200">
             {isSignup ? 'Sign Up' : 'Log In'}
           </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isSignup ? (
            <p className="text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log In</Link></p>
          ) : (
             <p className="text-slate-500">Don't have an account? <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Sign Up</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Profile Page ---
const ProfilePage = () => {
  const { user, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-emerald-900 h-32 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-lg">
               <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <UserIcon size={40} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="pt-14 px-8 pb-8">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-slate-500 flex items-center gap-2 capitalize">
                   <span className={`w-2 h-2 rounded-full ${user?.role === 'farmer' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                   {user?.role}
                </p>
             </div>
             <button 
               onClick={() => isEditing ? handleSave() : setIsEditing(true)}
               className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
             >
               {isEditing ? <><Save size={18}/> Save Changes</> : <><Settings size={18}/> Edit Profile</>}
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  ) : (
                    <div className="text-slate-900 font-medium">{user?.name}</div>
                  )}
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                  <div className="text-slate-900 font-medium">{user?.email || 'N/A'}</div>
               </div>
             </div>
             
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input 
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="+91..."
                    />
                  ) : (
                    <div className="text-slate-900 font-medium">{user?.phoneNumber || 'Not provided'}</div>
                  )}
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Location</label>
                  {isEditing ? (
                    <input 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="City, State"
                    />
                  ) : (
                    <div className="text-slate-900 font-medium flex items-center gap-1">
                      <MapPin size={16} className="text-slate-400"/> {user?.location || 'Unknown'}
                    </div>
                  )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Farmer Dashboard Components ---

const CreateListing = () => {
  const { user, addListing } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [form, setForm] = useState({
    cropName: '',
    quantity: '',
    price: '',
    location: user?.location || '',
    description: '',
    grade: 'B'
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const analysis = await analyzeCropImage(base64);
      if (analysis) {
        setForm(prev => ({
          ...prev,
          cropName: analysis.cropName || prev.cropName,
          grade: analysis.qualityGrade || prev.grade,
          price: analysis.estimatedPrice?.toString() || prev.price,
          description: analysis.description || prev.description
        }));
      }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePredictPrice = async () => {
    if (!form.cropName || !form.location) return;
    setLoading(true);
    const prediction = await predictPrice(form.cropName, form.location, 'current season');
    if (prediction?.minPrice && prediction?.maxPrice) {
      alert(`AI Prediction: ${prediction.currency} ${prediction.minPrice} - ${prediction.maxPrice}`);
      setForm(prev => ({ ...prev, price: ((prediction.minPrice + prediction.maxPrice) / 2).toFixed(2) }));
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      id: `l${Date.now()}`,
      farmerId: user!.id,
      farmerName: user!.name,
      cropName: form.cropName,
      quantity: Number(form.quantity),
      unit: 'kg', // simplified
      pricePerUnit: Number(form.price),
      location: form.location,
      qualityGrade: form.grade as any,
      description: form.description,
      status: 'active',
      createdAt: Date.now()
    });
    navigate('/dashboard');
  };

  const inputClass = "w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white text-slate-900";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const btnClass = "bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md flex items-center justify-center w-full";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <PlusCircle className="text-emerald-600" /> Create New Listing
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* AI Camera Section */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-emerald-50/50 transition cursor-pointer relative">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="flex flex-col items-center gap-2 text-slate-500">
            {analyzing ? <Loader2 className="animate-spin text-emerald-600" size={32}/> : <Camera size={32} className="text-emerald-500" />}
            <span className="font-medium text-emerald-700">Scan Crop with AI</span>
            <span className="text-xs">Upload a photo to auto-fill details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Crop Name</label>
              <input value={form.cropName} onChange={e => setForm({...form, cropName: e.target.value})} className={inputClass} placeholder="e.g. Potatoes" required />
            </div>
            <div>
              <label className={labelClass}>Quantity (kg)</label>
              <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} required />
            </div>
          </div>

          <div>
             <label className={`${labelClass} flex justify-between`}>
               <span>Expected Price (₹/kg)</span>
               <button type="button" onClick={handlePredictPrice} className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
                 {loading && <Loader2 size={12} className="animate-spin"/>} AI Price Suggestion
               </button>
             </label>
             <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} required />
          </div>

          <div>
            <label className={`${labelClass} flex justify-between`}>Description <span><Mic className="inline w-4 h-4 text-slate-400 cursor-pointer"/></span></label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} h-24`} placeholder="Describe your produce..." />
          </div>

          <button type="submit" className={`${btnClass} mt-4`}>Publish Listing</button>
        </form>
      </div>
    </div>
  );
};

// --- Payment Page ---

const PaymentPage = () => {
  const { state } = useLocation();
  const { user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState(user?.location || '');
  
  if (!state?.item) return <Navigate to="/dashboard" />;
  
  const { item } = state;

  // PURCHASE QUANTITY STATE
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(item.quantity);
  
  // Validation
  const isValidQuantity = purchaseQuantity > 0 && purchaseQuantity <= item.quantity;

  const totalAmount = item.pricePerUnit * (isValidQuantity ? purchaseQuantity : 0);
  const advanceAmount = totalAmount * 0.20; 
  const payNowAmount = paymentMethod === 'online' ? totalAmount : advanceAmount;
  const payLaterAmount = paymentMethod === 'cod' ? totalAmount - advanceAmount : 0;

  const handlePay = () => {
    if (!isValidQuantity) {
      alert(`Please enter a valid quantity between 1 and ${item.quantity}`);
      return;
    }
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        buyerId: user!.id,
        buyerName: user!.name,
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        listingId: item.id,
        cropName: item.cropName,
        quantity: purchaseQuantity,
        unit: item.unit,
        totalPrice: totalAmount,
        status: 'pending',
        createdAt: Date.now(),
        address: address
      };
      
      placeOrder(newOrder);
      
      setProcessing(false);
      alert(`Order Placed Successfully! \nStatus: Pending\nPaid: ₹${payNowAmount.toFixed(2)}`);
      navigate('/orders');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
           <ArrowLeft size={20} className="mr-2"/> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
           <div className="bg-emerald-900 p-6 text-white">
             <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard/> Secure Checkout</h1>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                   <Logo size="small" variant="white" />
                </div>
             </div>
             <p className="text-emerald-200 text-sm mt-1">Complete your purchase for {item.cropName}</p>
           </div>
           
           <div className="p-6 space-y-6">
             <div className="space-y-4">
                {/* Quantity Selection */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Step 1: Quantity</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-medium text-slate-500 mb-1">Purchase Quantity ({item.unit})</label>
                           <input 
                              type="number" 
                              min="1"
                              max={item.quantity}
                              value={purchaseQuantity}
                              onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                              className={`w-full border px-3 py-2 rounded-lg font-bold text-lg outline-none focus:ring-2 ${!isValidQuantity ? 'border-red-300 focus:ring-red-200 text-red-600' : 'border-slate-300 focus:ring-emerald-500 text-slate-900'}`}
                           />
                           <div className="text-xs text-slate-400 mt-1">Available: {item.quantity} {item.unit}</div>
                        </div>
                        <div className="text-right">
                           <label className="block text-xs font-medium text-slate-500 mb-1">Price per {item.unit}</label>
                           <div className="text-lg font-bold text-slate-900 pt-2">₹{item.pricePerUnit}</div>
                        </div>
                    </div>
                    {!isValidQuantity && (
                        <div className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded">
                           ⚠️ Error: Quantity must be between 1 and {item.quantity}
                        </div>
                    )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                   <textarea 
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     className="w-full border border-slate-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50 text-slate-900"
                     rows={3}
                     placeholder="Enter your full delivery address..."
                   />
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Summary</h3>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-700">{item.cropName} x {isValidQuantity ? purchaseQuantity : 0} {item.unit}</span>
                 <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-200 pt-2 mt-2">
                 <span>Delivery & Shipping</span>
                 <span className="text-emerald-600 font-medium">Free</span>
               </div>
               <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t border-slate-200 pt-3 mt-3">
                 <span>Total</span>
                 <span>₹{totalAmount.toFixed(2)}</span>
               </div>
             </div>

             <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Step 2: Payment</h3>
                <div className="space-y-3">
                  <label className={`block p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">Pay Online</div>
                        <div className="text-xs text-slate-500">Credit/Debit Card, UPI, NetBanking</div>
                      </div>
                      <CreditCard className={paymentMethod === 'online' ? "text-emerald-600" : "text-slate-400"} />
                    </div>
                  </label>

                  <label className={`block p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">Cash on Delivery</div>
                        <div className="text-xs text-slate-500">Pay 20% advance now, rest on delivery</div>
                      </div>
                      <Truck className={paymentMethod === 'cod' ? "text-emerald-600" : "text-slate-400"} />
                    </div>
                  </label>
                </div>
             </div>

             {paymentMethod === 'cod' && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm">
                   <div className="flex items-start gap-2 text-yellow-800">
                     <Banknote className="shrink-0 mt-0.5" size={16}/>
                     <div>
                       <span className="font-bold">Payment Breakdown:</span>
                       <ul className="mt-1 space-y-1 list-disc list-inside">
                         <li>Pay Now (20% Advance): <strong>₹{advanceAmount.toFixed(2)}</strong></li>
                         <li>Pay on Delivery: <strong>₹{payLaterAmount.toFixed(2)}</strong></li>
                       </ul>
                     </div>
                   </div>
                </div>
             )}
             
             <button 
                onClick={handlePay}
                disabled={processing || !isValidQuantity}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                {processing ? <Loader2 className="animate-spin"/> : (
                  <>
                    <span>Place Order</span>
                    <span className="text-emerald-200 font-normal text-sm">(₹{payNowAmount.toFixed(2)})</span>
                  </>
                )}
             </button>
             
             <div className="text-center">
               <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                 <ShieldCheck size={12}/> 100% Secure Payment with 256-bit Encryption
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Orders Page ---
const OrdersPage = () => {
  const { user, orders, updateOrderStatus, createChat } = useStore();
  const navigate = useNavigate();

  const myOrders = orders.filter(o => user?.role === 'farmer' ? o.farmerId === user.id : o.buyerId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleChat = (otherId: string) => {
    const roomId = createChat(otherId);
    navigate('/chat');
  };

  // Helper for tracking steps
  const steps = [
    { label: 'Order Placed', status: 'pending', icon: Package },
    { label: 'Confirmed', status: 'confirmed', icon: CheckCircle },
    { label: 'Shipped', status: 'shipped', icon: Truck },
    { label: 'Delivered', status: 'delivered', icon: MapPin }
  ];

  const getCurrentStepIndex = (status: OrderStatus) => {
     if (status === 'cancelled') return -1;
     const index = steps.findIndex(s => s.status === status);
     return index >= 0 ? index : 0; // default to 0 if pending
  };

  const availableStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Package className="text-emerald-600" /> 
          {user?.role === 'farmer' ? 'Incoming Orders' : 'My Orders'}
        </h1>
        <p className="text-slate-500">
          {user?.role === 'farmer' ? 'Manage orders and update shipping status.' : 'Track your purchases and delivery status.'}
        </p>
      </div>

      <div className="space-y-6">
        {myOrders.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
             <Box size={48} className="text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-slate-700">No orders found</h3>
             <p className="text-slate-500 mb-6">{user?.role === 'farmer' ? "You haven't received any orders yet." : "You haven't placed any orders yet."}</p>
             {user?.role === 'buyer' && (
                <Link to="/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
                  Start Shopping
                </Link>
             )}
           </div>
        ) : (
          myOrders.map(order => {
            const currentStepIndex = getCurrentStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{order.cropName}</h3>
                      {isCancelled && <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium bg-red-100 text-red-800 border-red-200">Cancelled</span>}
                    </div>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p className="flex items-center gap-2"><Clock size={14}/> Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2"><IndianRupee size={14}/> Total: ₹{order.totalPrice.toFixed(2)} ({order.quantity} {order.unit})</p>
                      <p className="flex items-center gap-2"><MapPin size={14}/> {order.address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[200px]">
                     <div className="text-right">
                       <p className="text-sm text-slate-500">Order ID</p>
                       <p className="font-mono text-xs text-slate-700">{order.id}</p>
                     </div>
                     
                     <div className="flex items-center gap-2 w-full justify-end">
                        <button 
                          onClick={() => handleChat(user?.role === 'farmer' ? order.buyerId : order.farmerId)}
                          className="text-slate-500 hover:text-emerald-600 p-2 border border-slate-200 rounded-lg transition"
                          title="Chat"
                        >
                          <MessageSquare size={18} />
                        </button>

                        {user?.role === 'farmer' && !isCancelled && (
                          <div className="relative group">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="appearance-none bg-emerald-50 border border-emerald-200 text-emerald-800 py-2 pl-4 pr-8 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                              {availableStatuses.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-600">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
                
                {/* Visual Tracking Timeline */}
                {!isCancelled && (
                    <div className="p-6 bg-slate-50/50">
                        <div className="relative">
                             <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
                                <div style={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"></div>
                             </div>
                             <div className="flex justify-between items-center text-xs sm:text-sm">
                                {steps.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    
                                    return (
                                        <div key={step.status} className={`flex flex-col items-center gap-2 ${isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                            <div className={`p-2 rounded-full border-2 ${isCompleted ? 'bg-white border-emerald-500 text-emerald-600' : 'bg-transparent border-slate-300'}`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="hidden sm:block">{step.label}</span>
                                        </div>
                                    )
                                })}
                             </div>
                        </div>
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- Produces Explorer (For Farmers to see other farmers' work) ---
const ProducesExplorer = () => {
  const { user, listings, createChat, addToCart } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Show all listings from *other* farmers
  const otherListings = listings.filter(l => l.farmerId !== user?.id && l.status === 'active')
    .filter(item => 
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleChat = (farmerId: string) => {
    const roomId = createChat(farmerId);
    navigate('/chat');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Wheat className="text-emerald-600" /> Market Produces
        </h1>
        <p className="text-slate-500">Explore what other farmers are listing in the marketplace.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for crops, locations..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherListings.map(item => (
           <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition group relative overflow-hidden">
               <div className="flex justify-between items-start mb-2 relative z-10">
                 <div className="flex items-start gap-4">
                   <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                      ) : (
                        <Wheat className="text-slate-400" />
                      )}
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">{item.cropName}</h3>
                     <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Users size={12}/> {item.farmerName}
                     </p>
                     <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={12}/> {item.location}
                     </p>
                   </div>
                 </div>
               </div>
               
               <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Price</div>
                    <div className="font-bold text-xl text-emerald-600 flex items-center gap-0.5">
                      <IndianRupee size={16} strokeWidth={3} />
                      {item.pricePerUnit}
                      <span className="text-xs font-normal text-slate-400">/{item.unit}</span>
                    </div>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <div className="text-sm">
                    <span className="text-slate-500">Qty: </span>
                    <span className="font-medium">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        addToCart(item);
                        alert(`${item.cropName} added to cart!`);
                      }}
                      className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition flex items-center gap-1"
                    >
                      <ShoppingCart size={14} /> Add
                    </button>
                    <button 
                      onClick={() => handleChat(item.farmerId)}
                      className="text-slate-400 hover:text-slate-600 px-2 py-1.5 text-sm transition"
                      title="Chat with Farmer"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
               </div>
           </div>
        ))}

        {otherListings.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Wheat size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No produces found</h3>
            <p className="text-slate-500">Check back later for new listings from other farmers.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user, listings, requests, createChat, purchaseListing } = useStore();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [findingMatches, setFindingMatches] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // AI Matching Logic
  useEffect(() => {
    if (user?.role === 'farmer') {
      const myActiveListings = listings.filter(l => l.farmerId === user.id);
      if (myActiveListings.length > 0) {
        setFindingMatches(true);
        matchOpportunities(myActiveListings, requests).then(res => {
          setMatches(res);
          setFindingMatches(false);
        });
      }
    } else if (user?.role === 'buyer') {
       setFindingMatches(true);
       matchOpportunities(listings, requests.filter(r => r.buyerId === user.id)).then(res => {
         setMatches(res);
         setFindingMatches(false);
       });
    }
  }, [user, listings, requests]);

  const handleChat = (otherId: string) => {
    const roomId = createChat(otherId);
    navigate('/chat');
  };

  const handleBuy = (item: any) => {
    // Navigate to payment page with item details
    navigate('/payment', { state: { item } });
  };

  // Filter Items for Marketplace
  const marketplaceItems = (user?.role === 'buyer' 
    ? listings.filter(l => l.status === 'active' && l.farmerId !== user.id) 
    : requests.filter(r => r.status === 'open' && r.buyerId !== user.id)
  ).filter(item => 
    item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* Hero / Welcome Section */}
      <div className="relative mb-8 bg-emerald-900 rounded-3xl p-8 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hello, {user?.name}</h1>
            <p className="text-emerald-100">
              {user?.role === 'farmer' ? 'Find buyers for your harvest today.' : 'Source fresh produce directly from farmers.'}
            </p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="relative group">
              <Search className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition" size={20} />
              <input 
                type="text" 
                placeholder={user?.role === 'farmer' ? "Search buyer requests..." : "Search for crops..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-emerald-400 outline-none shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - Sidebar (Quick Stats & Actions) */}
        <div className="lg:col-span-3 space-y-6">
           {/* Action Card */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                {user?.role === 'farmer' ? <Wheat size={32} strokeWidth={1.5} /> : <ShoppingCart size={32} strokeWidth={1.5} />}
             </div>
             <h3 className="font-bold text-slate-800 mb-1">{user?.role === 'farmer' ? 'Sell Your Produce' : 'Find Fresh Produce'}</h3>
             <p className="text-xs text-slate-500 mb-4">{user?.role === 'farmer' ? 'List your crops and reach thousands of buyers.' : 'Browse high-quality crops directly from farmers.'}</p>
             
             {user?.role === 'farmer' ? (
                <Link to="/create-listing" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md flex items-center justify-center w-full flex items-center justify-center gap-2">
                  <PlusCircle size={18} /> Post Listing
                </Link>
             ) : (
                <button onClick={() => document.getElementById('marketplace-feed')?.scrollIntoView({ behavior: 'smooth'})} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md flex items-center justify-center w-full flex items-center justify-center gap-2">
                  <ShoppingBag size={18} /> Start Buying
                </button>
             )}
           </div>

           {/* My Active Items Mini-List */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">
               {user?.role === 'farmer' ? 'My Listings' : 'My Requests'}
             </h3>
             <div className="space-y-3">
               {(user?.role === 'farmer' ? listings.filter(l => l.farmerId === user.id) : requests.filter(r => r.buyerId === user.id)).slice(0, 3).map(item => (
                 <div key={item.id} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                   <div>
                     <div className="font-medium text-slate-800">{item.cropName}</div>
                     <div className="text-xs text-slate-500">{(item as any).quantity || (item as any).quantityNeeded} {(item as any).unit || 'kg'}</div>
                   </div>
                   <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</div>
                 </div>
               ))}
               {(user?.role === 'farmer' ? listings.filter(l => l.farmerId === user.id) : requests.filter(r => r.buyerId === user.id)).length === 0 && (
                 <div className="text-xs text-slate-400 text-center py-2">No active items</div>
               )}
             </div>
           </div>
        </div>

        {/* MIDDLE COLUMN - Main Feed */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Marketplace Feed (Default Section) */}
          <div id="marketplace-feed">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-slate-400"/>
                {user?.role === 'buyer' ? 'All Listed Items' : 'Active Buyer Requests'}
              </h2>
              <span className="text-sm text-slate-500">{marketplaceItems.length} results</span>
            </div>
            
            <div className="space-y-4">
              {marketplaceItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-start gap-4">
                        {/* Image or Icon */}
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                           {(item as any).imageUrl ? (
                             <img src={(item as any).imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                           ) : (
                             <Wheat className="text-slate-400" />
                           )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">{item.cropName}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                             <Users size={12}/> {user?.role === 'buyer' ? (item as any).farmerName : (item as any).buyerName}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                             <MapPin size={12}/> {(item as any).location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-xl text-emerald-600 flex items-center justify-end gap-1">
                           <IndianRupee size={16} strokeWidth={3} />
                           {(item as any).pricePerUnit || (item as any).maxBudget}
                           <span className="text-xs font-normal text-slate-400 text-base">/{ (item as any).unit || 'kg'}</span>
                         </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                       <div className="text-sm">
                         <span className="text-slate-500">Qty: </span>
                         <span className="font-medium">{(item as any).quantity || (item as any).quantityNeeded} {(item as any).unit || 'kg'}</span>
                       </div>
                       <div className="flex gap-3">
                         {user?.role === 'buyer' && (
                           <button 
                             onClick={() => handleBuy(item)}
                             className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
                           >
                             <ShoppingBag size={16} /> Buy Now
                           </button>
                         )}
                         <button 
                           onClick={() => handleChat(user?.role === 'buyer' ? (item as any).farmerId : (item as any).buyerId)}
                           className={`${user?.role === 'buyer' ? 'text-slate-500 hover:text-slate-700' : 'text-emerald-700 hover:underline'} font-medium text-sm flex items-center gap-2`}
                         >
                           <MessageSquare size={16} /> {user?.role === 'buyer' ? 'Chat' : 'Start Conversation'}
                         </button>
                       </div>
                    </div>
                </div>
              ))}
              
              {marketplaceItems.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                  <Wheat size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700">No items found</h3>
                  <p className="text-slate-500">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Matches Section (Secondary) */}
          {(matches.length > 0 || findingMatches) && (
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                 <div className="bg-emerald-100 p-2 rounded-lg"><TrendingUp className="text-emerald-600" size={20} /></div>
                 <h2 className="text-xl font-bold text-slate-800">Top AI Matches For You</h2>
              </div>
              
              {findingMatches ? (
                <div className="flex items-center gap-2 text-slate-500 py-4"><Loader2 className="animate-spin text-emerald-600"/> Analyzing market data...</div>
              ) : (
                <div className="space-y-3 relative z-10">
                  {matches.slice(0, 3).map((match, idx) => {
                    const item = user?.role === 'farmer' 
                      ? requests.find(r => r.id === match.requestId) 
                      : listings.find(l => l.id === match.listingId);
                    if (!item) return null;
                    
                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm flex justify-between items-center hover:shadow-md transition cursor-pointer">
                        <div>
                           <div className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                             {item.cropName}
                             <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">{match.matchScore}% Match</span>
                           </div>
                           <div className="text-sm text-slate-500">{item.location} • <span className="italic text-slate-400 text-xs">{match.reason}</span></div>
                        </div>
                        <button onClick={() => handleChat(user?.role === 'farmer' ? (item as any).buyerId : (item as any).farmerId)} className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition shadow-sm shadow-emerald-200">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - Stats & Trends */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={18}/> Market Trends</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Potato</span>
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded text-xs">+5.2% ↗</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Corn</span>
                  <span className="text-red-500 font-bold bg-red-100 px-2 py-1 rounded text-xs">-1.2% ↘</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Wheat</span>
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded text-xs">+2.4% ↗</span>
                </div>
              </div>
           </div>
           
           <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-lg mb-2 text-emerald-300">Pro Plan</h3>
               <p className="text-slate-300 text-sm mb-4 leading-relaxed">Get advanced weather alerts, price forecasts, and priority support.</p>
               <button className="w-full bg-white text-slate-900 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition shadow">Upgrade Plan</button>
             </div>
             <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white">
               <Wheat size={120} />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- NEW COMPONENT: CreateRequest ---
const CreateRequest = () => {
  const { user, addRequest } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cropName: '',
    quantityNeeded: '',
    maxBudget: '',
    location: user?.location || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      id: `r${Date.now()}`,
      buyerId: user!.id,
      buyerName: user!.name,
      cropName: form.cropName,
      quantityNeeded: Number(form.quantityNeeded),
      maxBudget: Number(form.maxBudget),
      location: form.location,
      status: 'open',
      createdAt: Date.now()
    });
    navigate('/dashboard');
  };

  const inputClass = "w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white text-slate-900";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <PlusCircle className="text-emerald-600" /> Create Buyer Request
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Crop Name</label>
            <input value={form.cropName} onChange={e => setForm({...form, cropName: e.target.value})} className={inputClass} placeholder="e.g. Organic Tomatoes" required />
          </div>
          <div>
            <label className={labelClass}>Quantity Needed (kg)</label>
            <input type="number" value={form.quantityNeeded} onChange={e => setForm({...form, quantityNeeded: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Max Budget (Total ₹)</label>
            <input type="number" value={form.maxBudget} onChange={e => setForm({...form, maxBudget: e.target.value})} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Delivery Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} required />
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md w-full mt-4">
            Post Request
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/create-listing" element={<ProtectedRoute roles={['farmer']}><CreateListing /></ProtectedRoute>} />
                  <Route path="/create-request" element={<ProtectedRoute roles={['buyer']}><CreateRequest /></ProtectedRoute>} />
                  <Route path="/produces" element={<ProtectedRoute roles={['farmer']}><ProducesExplorer /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/payment" element={<ProtectedRoute roles={['buyer']}><PaymentPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)]">
                        <Chat />
                      </div>
                    </ProtectedRoute>
                  } />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;