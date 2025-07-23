"use client"

import { Home, Search, Library, Plus, Download, Disc3 } from "lucide-react"

interface Playlist {
  id: string
  name: string
  coverUrl: string
  songCount: number
}

interface SidebarProps {
  activeView: "home" | "search" | "albums" | "library"
  setActiveView: (view: "home" | "search" | "albums" | "library") => void
  playlists: Playlist[]
}

export function Sidebar({ activeView, setActiveView, playlists }: SidebarProps) {
  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="flex text-2xl font-semibold bg-white  bg-clip-text text-transparent">
         <img src="/logo.png" alt="logo" className="w-6 h-6 mr-2 mt-1" /> Music
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-2">
          <button
            onClick={() => setActiveView("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeView === "home"
                ? "bg-[#2a2a2a] text-white shadow-lg"
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveView("search")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeView === "search"
                ? "bg-[#2a2a2a] text-white shadow-lg"
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Search size={20} />
            <span className="font-medium">Search</span>
          </button>
          <button
            onClick={() => setActiveView("albums")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeView === "albums"
                ? "bg-[#2a2a2a] text-white shadow-lg"
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Disc3 size={20} />
            <span className="font-medium">Albums</span>
          </button>
          <button
            onClick={() => setActiveView("library")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeView === "library"
                ? "bg-[#2a2a2a] text-white shadow-lg"
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Library size={20} />
            <span className="font-medium">Your Library</span>
          </button>
        </div>

        {/* Playlists */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-sm font-semibold text-[#8a8a8a] uppercase tracking-wider">Playlists</h3>
            <button className="text-[#8a8a8a] hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#8a8a8a] hover:text-white hover:bg-[#242424] transition-all duration-200 group"
              >
                <img
                  src={playlist.coverUrl || "/placeholder.svg"}
                  alt={playlist.name}
                  className="w-10 h-10 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-white">{playlist.name}</p>
                  <p className="text-xs text-[#6a6a6a]">{playlist.songCount} songs</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Download */}
      <div className="p-3 border-t border-[#2a2a2a]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#8a8a8a] hover:text-white hover:bg-[#242424] transition-all duration-200">
          <Download size={20} />
          <span className="font-medium">Install App</span>
        </button>
      </div>
    </div>
  )
}
