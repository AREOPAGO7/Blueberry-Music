"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreHorizontal, Shuffle, Repeat, Mic2 } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  audioUrl: string
  liked: boolean
}

interface PlayerBarProps {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  volume: number
  isShuffled: boolean
  repeatMode: "off" | "all" | "one"
  togglePlayPause: () => void
  skipToNext: () => void
  skipToPrevious: () => void
  toggleLike: (songId: string) => void
  setIsShuffled: (shuffled: boolean) => void
  setRepeatMode: (mode: "off" | "all" | "one") => void
}

export function PlayerBar({
  currentSong,
  isPlaying,
  currentTime,
  volume,
  isShuffled,
  repeatMode,
  togglePlayPause,
  skipToNext,
  skipToPrevious,
  toggleLike,
  setIsShuffled,
  setRepeatMode,
}: PlayerBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentSong) return null

  return (
    <div className="h-24 bg-[#1e1e1e]/95 backdrop-blur-xl border-t border-[#2a2a2a] flex items-center px-6">
      {/* Current Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        <div className="relative">
          <img
            src={currentSong.coverUrl || "/placeholder.svg"}
            alt={currentSong.title}
            className="w-16 h-16 rounded-xl object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate text-white">{currentSong.title}</p>
          <p className="text-sm text-[#8a8a8a] truncate">{currentSong.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(currentSong.id)}
          className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"
        >
          <Heart size={18} className={currentSong.liked ? "fill-purple-400 text-purple-400" : ""} />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-3 max-w-2xl mx-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isShuffled ? "text-purple-400 bg-purple-400/10" : "text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            <Shuffle size={18} />
          </button>
          <button
            onClick={skipToPrevious}
            className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"
          >
            <SkipBack size={22} />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button
            onClick={skipToNext}
            className="text-[#8a8a8a] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2a2a2a]"
          >
            <SkipForward size={22} />
          </button>
          <button
            onClick={() => setRepeatMode(repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off")}
            className={`p-2 rounded-lg transition-all duration-200 relative ${
              repeatMode !== "off"
                ? "text-purple-400 bg-purple-400/10"
                : "text-[#8a8a8a] hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            <Repeat size={18} />
            {repeatMode === "one" && (
              <span className="absolute -top-1 -right-1 text-xs bg-purple-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-[#8a8a8a] w-12 text-right font-mono">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#8a8a8a] w-12 font-mono">{formatTime(currentSong.duration)}</span>
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
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
