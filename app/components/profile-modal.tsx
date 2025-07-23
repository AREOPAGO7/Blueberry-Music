"use client"

import { X, Settings, LogOut, User, Crown, Download } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md border border-[#2a2a2a]">
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">John Doe</h3>
              <p className="text-sm text-[#8a8a8a]">john.doe@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-xl border border-purple-500/20">
            <Crown size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Premium Member</span>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-xs text-[#8a8a8a] uppercase tracking-wide">Songs Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-xs text-[#8a8a8a] uppercase tracking-wide">Playlists</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-xs text-[#8a8a8a] uppercase tracking-wide">Following</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a] transition-all duration-200">
              <Settings size={18} />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a] transition-all duration-200">
              <Download size={18} />
              <span className="font-medium">Downloads</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a] transition-all duration-200">
              <Crown size={18} />
              <span className="font-medium">Upgrade to Premium</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
