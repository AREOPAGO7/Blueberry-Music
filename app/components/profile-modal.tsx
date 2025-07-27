"use client"

import { X, Settings, LogOut, User, Crown, Download } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        setUser(null);
        onClose();
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-md border border-[#2a2a2a]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-gray-400 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user?.username || 'Guest'}</h3>
              <p className="text-sm text-[#8a8a8a]">{user?.email || 'Not signed in'}</p>
            </div>
          </div>

          
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl   "
          >
            
           <button className="flex text-zinc-300 items-center gap-2 cursor-pointer border-1 hover:text-red-400  border-zinc-700 px-6 py-2 rounded-lg">
           <LogOut size={18} />
             <span className="font-semibold">Sign Out</span>
           </button>
          </button>
        </div>
      </div>
    </div>
  )
}
