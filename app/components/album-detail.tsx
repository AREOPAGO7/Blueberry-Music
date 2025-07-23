"use client"

import { Play, Heart, MoreHorizontal, Clock, ArrowLeft } from "lucide-react"

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

interface Album {
  id: string
  title: string
  artist: string
  coverUrl: string
  year: number
  songs: Song[]
  genre?: string
  totalDuration?: number
}

interface AlbumDetailProps {
  album: Album
  onBack: () => void
  onPlaySong: (song: Song, songList: Song[]) => void
  onToggleLike: (songId: string) => void
  formatTime: (seconds: number) => string
}

export function AlbumDetail({ album, onBack, onPlaySong, onToggleLike, formatTime }: AlbumDetailProps) {
  const totalDuration = album.songs.reduce((total, song) => total + song.duration, 0)

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8a8a8a] hover:text-white transition-colors pt-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Album Header */}
      <div className="flex items-end gap-8">
        <div className="relative">
          <img
            src={album.coverUrl || "/placeholder.svg"}
            alt={album.title}
            className="w-64 h-64 rounded-2xl shadow-2xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
        </div>
        <div className="flex-1 pb-4">
          <p className="text-sm text-[#8a8a8a] uppercase tracking-wider mb-2">Album</p>
          <h1 className="text-5xl font-bold mb-4 text-white">{album.title}</h1>
          <div className="flex items-center gap-2 text-[#8a8a8a] mb-4">
            <span className="text-white font-semibold">{album.artist}</span>
            <span>•</span>
            <span>{album.year}</span>
            <span>•</span>
            <span>{album.songs.length} songs</span>
            <span>•</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
          {album.genre && <p className="text-[#8a8a8a] mb-6">{album.genre}</p>}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlaySong(album.songs[0], album.songs)}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Play size={24} fill="white" className="ml-1" />
            </button>
            <button className="text-[#8a8a8a] hover:text-white transition-colors p-3 rounded-full hover:bg-[#2a2a2a]">
              <Heart size={24} />
            </button>
            <button className="text-[#8a8a8a] hover:text-white transition-colors p-3 rounded-full hover:bg-[#2a2a2a]">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-[#8a8a8a] text-sm border-b border-[#2a2a2a]">
          <span className="w-8 text-center">#</span>
          <span>Title</span>
          <span className="w-16 text-center">
            <Heart size={16} />
          </span>
          <span className="w-16 text-center">
            <Clock size={16} />
          </span>
        </div>

        {/* Tracks */}
        {album.songs.map((song, index) => (
          <div
            key={song.id}
            className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 rounded-xl hover:bg-[#2a2a2a]/50 cursor-pointer group transition-all duration-200"
            onClick={() => onPlaySong(song, album.songs)}
          >
            <div className="w-8 text-center text-[#8a8a8a] group-hover:text-white flex items-center justify-center">
              <span className="group-hover:hidden">{index + 1}</span>
              <Play size={16} fill="white" className="hidden group-hover:block ml-0.5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate text-white group-hover:text-white">{song.title}</p>
              <p className="text-sm text-[#8a8a8a] truncate">{song.artist}</p>
            </div>
            <div className="w-16 flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleLike(song.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#3a3a3a]/50"
              >
                <Heart
                  size={16}
                  className={song.liked ? "fill-purple-400 text-purple-400" : "text-[#8a8a8a] hover:text-white"}
                />
              </button>
            </div>
            <div className="w-16 text-center text-[#8a8a8a] text-sm font-mono">{formatTime(song.duration)}</div>
          </div>
        ))}
      </div>

      {/* Album Info */}
      <div className="pt-8 border-t border-[#2a2a2a]">
        <p className="text-[#8a8a8a] text-sm leading-relaxed">
          Released {album.year} • {album.songs.length} tracks • {formatTime(totalDuration)} total duration
        </p>
      </div>
    </div>
  )
}
