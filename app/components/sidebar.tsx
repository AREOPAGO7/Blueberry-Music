"use client"

import { Home, Search, Library, Plus, Download, Disc3, HeartPlus } from "lucide-react"
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  // Determine active view based on current pathname
  const getActiveView = () => {
    if (pathname === "/") return "home";
    if (pathname === "/search") return "search";
    if (pathname === "/albums") return "albums";
    if (pathname === "/library") return "library";
    return "home"; // default fallback
  };

  const currentActiveView = getActiveView();

  return (
    <div className="w-54 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="flex text-xl font-semibold bg-white  bg-clip-text text-transparent">
         <img src="/logo.png" alt="logo" className="w-6 h-6 mr-2 " /> Music
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-2">
          <button
            onClick={() => router.push("/")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
              currentActiveView === "home"
                ? "bg-[#2a2a2a] text-white "
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Home size={20} />
            <span className="font-semibold text-sm">Home</span>
          </button>
          <button
            onClick={() => router.push("/search")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
              currentActiveView === "search"
                ? "bg-[#2a2a2a] text-white "
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Search size={20} />
            <span className="font-semibold text-sm">Search</span>
          </button>
          <button
            onClick={() => router.push("/albums")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
              currentActiveView === "albums"
                ? "bg-[#2a2a2a] text-white "
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Disc3 size={20} />
            <span className="font-semibold text-sm">Albums</span>
          </button>
          <button
            onClick={() => router.push("/library")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
              currentActiveView === "library"
                ? "bg-[#2a2a2a] text-white "
                : "text-[#8a8a8a] hover:text-white hover:bg-[#242424]"
            }`}
          >
            <Library size={20} />
            <span className="font-semibold text-sm">Your Library</span>
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
           
              <button
                
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[#8a8a8a] hover:text-white hover:bg-[#242424] transition-all duration-200 group"
              >
                <HeartPlus />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-white">Liked Songs</p>
                  <p className="text-xs text-[#6a6a6a]">{0} songs</p>
                </div>
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
                  className="w-6 h-7 rounded-lg  shadow-md"
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

      
    </div>
  )
}
