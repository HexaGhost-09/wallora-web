"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats, checkDatabaseConnection } from "./actions";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Settings, 
  LogOut, 
  Activity, 
  Shield, 
  Zap,
  ChevronRight,
  Search,
  Bell,
  Terminal
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalDownloads: 0,
    dailyVisits: 0,
    dailyDownloads: 0,
    monthlyVisits: 0,
    monthlyDownloads: 0,
    liveUsers: 0,
    admins: 0,
    chartData: [] as any[],
    recentLogs: [] as any[]
  });
  const [dbStatus, setDbStatus] = useState({ status: "checking", latency: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    const data = await getDashboardStats();
    setStats(data);
    
    const db = await checkDatabaseConnection();
    setDbStatus(db);
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
    
    // Auto refresh every 30 seconds for 'live' feeling
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/vault/access");
    router.refresh();
  };

  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "users", icon: Users, label: "Manage Admins" },
    { id: "database", icon: Database, label: "Neon Explorer" },
    { id: "logs", icon: Terminal, label: "System Logs" },
    { id: "settings", icon: Settings, label: "Vault Settings" },
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-white/5 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Wallora Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-white/5 z-[80] transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="hidden lg:flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Wallora Panel</span>
          </div>

          <nav className="space-y-2 flex-grow">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Secure Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 lg:mb-12 bg-zinc-900/40 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/5">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
               <img src="https://ui-avatars.com/api/?name=Admin&background=101010&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm text-zinc-500 font-medium">Welcome Back,</h2>
              <p className="text-lg font-bold">System Administrator</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto">
             <div className="relative group flex-grow sm:flex-grow-0">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-black/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
               />
             </div>
             <button className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors relative flex-shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border border-black" />
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-6 md:space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: "Live Users", value: stats.liveUsers.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Daily Visits", value: stats.dailyVisits.toString(), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Monthly Visits", value: stats.monthlyVisits.toString(), icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { label: "Total Visits", value: stats.totalVisits.toString(), icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-colors">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: "Daily APK", value: stats.dailyDownloads.toString(), icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10" },
                    { label: "Monthly APK", value: stats.monthlyDownloads.toString(), icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    { label: "Total APK", value: stats.totalDownloads.toString(), icon: Zap, color: "text-red-400", bg: "bg-red-500/10" },
                    { label: "Admins", value: stats.admins.toString(), icon: Shield, color: "text-violet-400", bg: "bg-violet-500/10" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-colors">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Traffic Graph */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 mt-8">
                  <h3 className="text-xl font-bold mb-6">Traffic Analytics (Last 7 Days)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#a78bfa' }}
                        />
                        <Area type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Main Dashboard Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mt-8">
                   <div className="xl:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
                     <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold">Recent System Activity</h3>
                       <button className="text-sm text-indigo-400 hover:underline">View all</button>
                     </div>
                     
                     <div className="space-y-4 sm:space-y-6">
                        {stats.recentLogs.map((log, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-default gap-4">
                             <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />
                                <div>
                                   <p className="font-medium text-white line-clamp-1">{log.action}</p>
                                   <p className="text-sm text-zinc-500 line-clamp-1">{log.details}</p>
                                </div>
                             </div>
                             <span className="text-[10px] sm:text-xs text-zinc-600 uppercase font-bold flex-shrink-0">
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                        ))}
                        {stats.recentLogs.length === 0 && (
                          <p className="text-center text-zinc-600 py-10">No recent activity logs.</p>
                        )}
                     </div>
                   </div>

                   <div className={`bg-gradient-to-br transition-all duration-500 rounded-3xl p-6 sm:p-8 relative overflow-hidden group ${
                     dbStatus.status === "healthy" ? "from-indigo-600 to-indigo-900" : "from-red-600 to-red-900"
                   }`}>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
                      <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                            <Shield className={`w-12 h-12 text-white mb-6 ${isRefreshing ? "animate-pulse" : ""}`} />
                            <h3 className="text-2xl font-bold text-white mb-2">Neon Database Status</h3>
                            <p className="text-indigo-100/70 text-sm">
                              {dbStatus.status === "healthy" 
                                ? `Your serverless PostgreSQL instance is currently healthy and responding within ${dbStatus.latency}ms.`
                                : "The database is currently unreachable. Please check your DATABASE_URL."}
                            </p>
                            {(dbStatus as any).error && (
                              <p className="mt-4 text-xs text-red-100 font-mono bg-black/40 p-3 rounded-lg border border-red-500/30 max-h-32 overflow-y-auto w-full">
                                {(dbStatus as any).error}
                              </p>
                            )}
                         </div>
                         <button 
                           onClick={fetchStats}
                           disabled={isRefreshing}
                           className="mt-8 bg-white text-indigo-900 font-bold py-3 px-6 rounded-2xl flex items-center justify-center hover:bg-zinc-100 transition-all disabled:opacity-50 w-full sm:w-auto"
                         >
                            {isRefreshing ? "Checking..." : "Check Connection"}
                            {!isRefreshing && <ChevronRight className="ml-2 w-4 h-4" />}
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-8">Full System Audit Logs</h3>
                <div className="space-y-4">
                  {stats.recentLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center space-x-4">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-zinc-500">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-sm text-zinc-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "database" && (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center py-20">
                <Database className="w-16 h-16 text-indigo-500 mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl font-bold mb-4">APK Management Ready</h3>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">Upload new APK versions and monitor download URLs directly from here.</p>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-bold">
                   Feature Provisioned
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Admin Privileges</h3>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    + Invite Admin
                  </button>
                </div>
                <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                   <div className="grid grid-cols-4 p-4 border-b border-white/5 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                      <div className="col-span-2">User</div>
                      <div>Role</div>
                      <div>Status</div>
                   </div>
                   <div className="grid grid-cols-4 p-4 items-center">
                      <div className="col-span-2 flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">AD</div>
                         <div>
                            <p className="font-bold">System Administrator</p>
                            <p className="text-xs text-zinc-500">primary@wallora.com</p>
                         </div>
                      </div>
                      <div className="text-sm font-medium text-indigo-400">Super Admin</div>
                      <div><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">Active</span></div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 max-w-2xl">
                <h3 className="text-xl font-bold mb-8">Vault Configuration</h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div>
                         <p className="font-bold">Two-Factor Authentication</p>
                         <p className="text-sm text-zinc-500 mt-1">Require 2FA for all vault administrators</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div>
                         <p className="font-bold">Maintenance Mode</p>
                         <p className="text-sm text-zinc-500 mt-1">Suspend API and restrict public dashboard access</p>
                      </div>
                      <div className="w-12 h-6 bg-zinc-700 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
