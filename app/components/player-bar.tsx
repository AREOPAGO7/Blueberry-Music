"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreHorizontal, Shuffle, Repeat, Mic2 } from "lucide-react"

export function PlayerBar() {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-24 bg-[#1e1e1e]/95 backdrop-blur-xl border-t border-[#2a2a2a] flex items-center px-6">
      {/* Current Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        <div className="relative">
          <img
            src="/placeholder.svg"
            alt="Song"
            className="w-16 h-16 rounded-lg object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate text-white">No song playing</p>
          <p className="text-sm text-[#8a8a8a] truncate">Select a song to start</p>
        </div>
        <button className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]">
          <Heart size={18} className="cursor-pointer" />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl mx-8">
        <div className="flex items-center gap-6">
          <button className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]">
            <Shuffle size={18} />
          </button>
          <button className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]">
            <SkipBack size={22} />
          </button>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black cursor-pointer shadow-lg">
            <Play size={22} className="ml-0.5" />
          </button>
          <button className="text-[#8a8a8a] hover:text-white transition-colors p-2 cursor-pointer rounded-lg hover:bg-[#2a2a2a]">
            <SkipForward size={22} />
          </button>
          <button className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]">
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-[#8a8a8a] w-12 text-right font-mono">{formatTime(0)}</span>
          <div className="flex-1 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: "0%" }}
            />
          </div>
          <span className="text-xs text-[#8a8a8a] w-12 font-mono">{formatTime(0)}</span>
        </div>
      </div>

      {/* Volume and Additional Controls */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <button className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]">
          <Mic2 size={18} />
        </button>
        <button className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]">
          <MoreHorizontal size={18} />
        </button>
        <div className="flex items-center gap-3">
          <Volume2 size={18} className="text-[#8a8a8a]" />
          <div className="w-24 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-white rounded-full transition-all duration-200"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
