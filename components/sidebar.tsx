"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wand2, Bookmark, Download, Settings, LogOut, Video, User } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generate Script", href: "/dashboard/generate", icon: Wand2 },
  { name: "Saved Scripts", href: "/dashboard/saved", icon: Bookmark },
  { name: "Export", href: "/dashboard/export", icon: Download },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Read auth status
    const stored = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(stored);

    // Listen for storage change events (syncing between pages)
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    // Dispatch event to notify other windows/tabs/components on same page
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    window.location.reload();
  };

  return (
    <div className="sidebar-gradient w-64 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="bg-gradient-to-tr from-violet-500 to-pink-500 text-white p-2 rounded-xl shadow-lg shadow-violet-500/30">
            <Video className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            UGC<span className="text-pink-400">AD</span><span className="text-violet-300">.AI</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/50 to-pink-600/30 text-white shadow-lg shadow-violet-500/10 border border-white/10"
                    : "text-violet-200/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-6 border-t border-white/5">
        {isLoggedIn ? (
          <div className="space-y-3">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                K
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Kishore Kumar</p>
                <p className="text-[10px] text-violet-200/60 truncate">kishore@example.com</p>
              </div>
            </div>

            <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-violet-200/60 hover:text-white hover:bg-white/5 w-full transition-all text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 w-full transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleLogin}
              className="btn-gradient w-full justify-center py-2.5 text-sm shadow-md"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={handleLogin}
              className="input-glass w-full text-center hover:bg-white/10 transition-colors text-sm font-semibold py-2.5"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

