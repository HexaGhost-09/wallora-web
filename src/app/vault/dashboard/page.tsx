"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getDashboardStats } from "./actions";
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
    visits: 0,
    downloads: 0,
    admins: 0,
    recentLogs: [] as any[]
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
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
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-white/5 z-50">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Wallora Panel</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-72 pt-8 pr-8 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=101010&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm text-zinc-500 font-medium">Welcome Back,</h2>
              <p className="text-lg font-bold">System Administrator</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
               <input 
                 type="text" 
                 placeholder="Search Vault..." 
                 className="bg-black/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
               />
             </div>
             <button className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors relative">
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
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: "Active Admins", value: stats.admins.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Total Visits", value: stats.visits.toString(), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "APK Downloads", value: stats.downloads.toString(), icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10" },
                    { label: "System Health", value: "Optimal", icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/10" },
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

                {/* Main Dashboard Section */}
                <div className="grid grid-cols-3 gap-8">
                   <div className="col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-8">
                     <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-bold">Recent System Activity</h3>
                       <button className="text-sm text-indigo-400 hover:underline">View all</button>
                     </div>
                     
                     <div className="space-y-6">
                        {stats.recentLogs.map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-default">
                             <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <div>
                                   <p className="font-medium text-white">{log.action}</p>
                                   <p className="text-sm text-zinc-500">{log.details}</p>
                                </div>
                             </div>
                             <span className="text-xs text-zinc-600 uppercase font-bold">
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                        ))}
                        {stats.recentLogs.length === 0 && (
                          <p className="text-center text-zinc-600 py-10">No recent activity logs.</p>
                        )}
                     </div>
                   </div>

                   <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
                      <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                            <Shield className="w-12 h-12 text-white mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">Neon Database Status</h3>
                            <p className="text-indigo-100/70 text-sm">Your serverless PostgreSQL instance is currently healthy and responding within 24ms.</p>
                         </div>
                         <button className="mt-8 bg-white text-indigo-900 font-bold py-3 px-6 rounded-2xl flex items-center justify-center hover:bg-zinc-100 transition-all">
                            Check Connection
                            <ChevronRight className="ml-2 w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab !== "overview" && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                <Database className="w-16 h-16 mb-6 opacity-20" />
                <h3 className="text-xl font-medium">Module under construction</h3>
                <p className="text-sm mt-2">The <span className="text-indigo-400">{activeTab}</span> component is being provisioned.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
