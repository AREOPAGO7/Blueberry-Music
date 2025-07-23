"use client"

import { useState, useRef } from "react"
import { Play, Heart, Search, User } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"
import { PlayerBar } from "@/app/components/player-bar"
import { ProfileModal } from "@/app/components/profile-modal"
import { AlbumDetail } from "@/app/components/album-detail"

// Types for easy database integration
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

interface Playlist {
  id: string
  name: string
  coverUrl: string
  songCount: number
  songs: Song[]
}

// Mock data - replace with database calls
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 234,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: true,
  },
  {
    id: "2",
    title: "Stellar Nights",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 198,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: false,
  },
  {
    id: "3",
    title: "Cosmic Lullaby",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 267,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: true,
  },
  {
    id: "4",
    title: "Neon Lights",
    artist: "Cyber Wave",
    album: "Digital Horizon",
    duration: 198,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: false,
  },
  {
    id: "5",
    title: "Electric Dreams",
    artist: "Cyber Wave",
    album: "Digital Horizon",
    duration: 223,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: true,
  },
  {
    id: "6",
    title: "Binary Love",
    artist: "Cyber Wave",
    album: "Digital Horizon",
    duration: 189,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: false,
  },
  {
    id: "7",
    title: "Stellar Journey",
    artist: "Cosmic Drift",
    album: "Space Odyssey",
    duration: 267,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: true,
  },
  {
    id: "8",
    title: "Galactic Winds",
    artist: "Cosmic Drift",
    album: "Space Odyssey",
    duration: 245,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: false,
  },
  {
    id: "9",
    title: "Urban Pulse",
    artist: "City Beats",
    album: "Metropolitan",
    duration: 189,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: false,
  },
  {
    id: "10",
    title: "Street Symphony",
    artist: "City Beats",
    album: "Metropolitan",
    duration: 201,
    coverUrl: "/placeholder.svg?height=300&width=300",
    audioUrl: "",
    liked: true,
  },
]

const mockAlbums: Album[] = [
  {
    id: "1",
    title: "Die Lit",
    artist: "Playboi Carti",
    coverUrl: "/albums/dieLit.jpg",
    year: 2024,
    genre: "Electronic",
    songs: mockSongs.filter((song) => song.album === "Nocturnal Vibes"),
  },
  {
    id: "2",
    title: "Playboi Carti",
    artist: "Playboi Carti",
    coverUrl: "/albums/selfTitled.jpg",
    year: 2023,
    genre: "Synthwave",
    songs: mockSongs.filter((song) => song.album === "Digital Horizon"),
  },
  {
    id: "3",
    title: "Whole Lotta Red",
    artist: "Playboi Carti",
    coverUrl: "/albums/WLR.jpg",
    year: 2024,
    genre: "Ambient",
    songs: mockSongs.filter((song) => song.album === "Space Odyssey"),
  },
  {
    id: "4",
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    coverUrl: "/albums/MBDTF.jpg",
    year: 2023,
    genre: "Hip-Hop",
    songs: mockSongs.filter((song) => song.album === "Metropolitan"),
  },
  {
    id: "5",
    title: "Father Stretch My Hands Pt.1",
    artist: "Kanye West",
    coverUrl: "/albums/FSMH.jpg",
    year: 2024,
    genre: "Synthpop",
    songs: [],
  },
  {
    id: "6",
    title: "Ocean Dreams",
    artist: "Aqua Sounds",
    coverUrl: "/placeholder.svg?height=300&width=300",
    year: 2023,
    genre: "Chillout",
    songs: [],
  },
]

const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Liked Songs",
    coverUrl: "/placeholder.svg?height=300&width=300",
    songCount: 42,
    songs: mockSongs.filter((song) => song.liked),
  },
  {
    id: "2",
    name: "Chill Vibes",
    coverUrl: "/placeholder.svg?height=300&width=300",
    songCount: 28,
    songs: mockSongs,
  },
]

export default function MusicPlayer() {
  // State management
  const [currentSong, setCurrentSong] = useState<Song | null>(mockSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [activeView, setActiveView] = useState<"home" | "search" | "albums" | "library">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [queue, setQueue] = useState<Song[]>(mockSongs)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Play/pause functionality
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Skip functions
  const skipToNext = () => {
    const nextIndex = (currentIndex + 1) % queue.length
    setCurrentIndex(nextIndex)
    setCurrentSong(queue[nextIndex])
  }

  const skipToPrevious = () => {
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentSong(queue[prevIndex])
  }

  // Play specific song
  const playSong = (song: Song, songList: Song[] = mockSongs) => {
    setCurrentSong(song)
    setQueue(songList)
    setCurrentIndex(songList.findIndex((s) => s.id === song.id))
    setIsPlaying(true)
  }

  // Toggle like
  const toggleLike = (songId: string) => {
    // This would update the database
    console.log("Toggle like for song:", songId)
  }

  // Album functions
  const openAlbum = (album: Album) => {
    setSelectedAlbum(album)
  }

  const closeAlbum = () => {
    setSelectedAlbum(null)
  }

  // Search functionality
  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAlbums = mockAlbums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} playlists={mockPlaylists} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 bg-gradient-to-b from-[#1e1e1e]/80 to-transparent flex items-center justify-between px-8 backdrop-blur-xl border-b border-[#2a2a2a]/50">
            <div className="flex items-center gap-4">
              <button className="w-9 h-9 rounded-full bg-[#2a2a2a]/60 flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-[#3a3a3a]/60 transition-all duration-200">
                ←
              </button>
              <button className="w-9 h-9 rounded-full bg-[#2a2a2a]/60 flex items-center justify-center text-[#8a8a8a] hover:text-white hover:bg-[#3a3a3a]/60 transition-all duration-200">
                →
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg">
                Upgrade
              </button>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                <User size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {selectedAlbum ? (
              <AlbumDetail
                album={selectedAlbum}
                onBack={closeAlbum}
                onPlaySong={playSong}
                onToggleLike={toggleLike}
                formatTime={formatTime}
              />
            ) : (
              <>
                {activeView === "home" && (
                  <div className="space-y-10">
                    {/* Greeting */}
                    <div className="pt-6">
                      <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-[#b0b0b0] bg-clip-text text-transparent">
                        Good evening
                      </h2>
                      <p className="text-[#8a8a8a] text-lg">Ready to discover new music?</p>
                    </div>

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockPlaylists.slice(0, 6).map((playlist) => (
                        <button
                          key={playlist.id}
                          className="flex items-center gap-4 bg-[#2a2a2a]/30 hover:bg-[#2a2a2a]/50 rounded-2xl p-3 transition-all duration-300 group shadow-lg hover:shadow-xl"
                        >
                          <img
                            src={playlist.coverUrl || "/placeholder.svg"}
                            alt={playlist.name}
                            className="w-20 h-20 rounded-xl object-cover shadow-md"
                          />
                          <span className="font-semibold text-lg">{playlist.name}</span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                              <Play size={20} fill="white" className="ml-0.5" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Recently Played */}
                    <div>
                      <h3 className="text-3xl font-bold mb-8 text-white">Recently played</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {mockAlbums.slice(0, 5).map((album) => (
                          <div key={album.id} className="group cursor-pointer" onClick={() => openAlbum(album)}>
                            <div className="relative mb-6">
                              <img
                                src={album.coverUrl || "/placeholder.svg"}
                                alt={album.title}
                                className="w-full h-70  rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl">
                                  <Play size={20} fill="white" className="ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2 truncate">{album.title}</h4>
                            <p className="text-[#8a8a8a] truncate">{album.artist}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Made for You */}
                    <div>
                      <h3 className="text-3xl font-bold mb-8 text-white">Made for you</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {mockPlaylists.map((playlist) => (
                          <div key={playlist.id} className="group cursor-pointer">
                            <div className="relative mb-6">
                              <img
                                src={playlist.coverUrl || "/placeholder.svg"}
                                alt={playlist.name}
                                className="w-full aspect-square object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl">
                                  <Play size={20} fill="white" className="ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2 truncate">{playlist.name}</h4>
                            <p className="text-[#8a8a8a] truncate">{playlist.songCount} songs</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "search" && (
                  <div className="space-y-8">
                    <div className="pt-6">
                      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#b0b0b0] bg-clip-text text-transparent">
                        Search
                      </h2>
                      <div className="relative max-w-lg">
                        <Search
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="What do you want to listen to?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-6 py-4 bg-[#2a2a2a]/50 rounded-2xl text-white placeholder-[#8a8a8a] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-[#2a2a2a]/70 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {searchQuery ? (
                      <div className="space-y-8">
                        {/* Albums Results */}
                        {filteredAlbums.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6">Albums</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                              {filteredAlbums.map((album) => (
                                <div key={album.id} className="group cursor-pointer" onClick={() => openAlbum(album)}>
                                  <div className="relative mb-4">
                                    <img
                                      src={album.coverUrl || "/placeholder.svg"}
                                      alt={album.title}
                                      className="w-full aspect-square object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Play size={16} fill="white" className="ml-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                  <h4 className="font-semibold mb-1 truncate">{album.title}</h4>
                                  <p className="text-sm text-[#8a8a8a] truncate">{album.artist}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Songs Results */}
                        {filteredSongs.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold mb-6">Songs</h3>
                            <div className="space-y-3">
                              {filteredSongs.map((song, index) => (
                                <div
                                  key={song.id}
                                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#2a2a2a]/50 cursor-pointer group transition-all duration-200"
                                  onClick={() => playSong(song)}
                                >
                                  <div className="relative">
                                    <img
                                      src={song.coverUrl || "/placeholder.svg"}
                                      alt={song.title}
                                      className="w-14 h-14 rounded-xl object-cover shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                      <Play size={18} fill="white" className="ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate text-white">{song.title}</p>
                                    <p className="text-sm text-[#8a8a8a] truncate">{song.artist}</p>
                                  </div>
                                  <p className="text-sm text-[#8a8a8a] font-mono">{formatTime(song.duration)}</p>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleLike(song.id)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-[#3a3a3a]/50"
                                  >
                                    <Heart
                                      size={18}
                                      className={song.liked ? "fill-purple-400 text-purple-400" : "text-[#8a8a8a]"}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-2xl font-bold mb-6">Browse all</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {["Pop", "Hip-Hop", "Rock", "Electronic", "Jazz", "Classical", "R&B", "Country"].map(
                            (genre) => (
                              <div
                                key={genre}
                                className="aspect-square bg-gradient-to-br from-purple-600 to-violet-800 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl"
                              >
                                <h4 className="text-2xl font-bold">{genre}</h4>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeView === "albums" && (
                  <div className="space-y-8">
                    <div className="pt-6">
                      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#b0b0b0] bg-clip-text text-transparent">
                        Albums
                      </h2>
                      <div className="flex gap-3 mb-8">
                        <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-semibold shadow-lg">
                          All Albums
                        </button>
                        <button className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-2xl text-sm font-semibold transition-colors">
                          Recently Added
                        </button>
                        <button className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-2xl text-sm font-semibold transition-colors">
                          A-Z
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {mockAlbums.map((album) => (
                        <div key={album.id} className="group cursor-pointer" onClick={() => openAlbum(album)}>
                          <div className="relative mb-4">
                            <img
                              src={album.coverUrl || "/placeholder.svg"}
                              alt={album.title}
                              className="w-full aspect-square object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Play size={16} fill="white" className="ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <h4 className="font-bold mb-1 truncate">{album.title}</h4>
                          <p className="text-sm text-[#8a8a8a] truncate">{album.artist}</p>
                          <p className="text-xs text-[#6a6a6a] truncate">
                            {album.year} • {album.genre}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeView === "library" && (
                  <div className="space-y-8">
                    <div className="pt-6">
                      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-[#b0b0b0] bg-clip-text text-transparent">
                        Your Library
                      </h2>
                      <div className="flex gap-3 mb-8">
                        <button className="px-6 py-3 bg-purple-600 rounded-2xl text-sm font-semibold shadow-lg">
                          All
                        </button>
                        <button className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-2xl text-sm font-semibold transition-colors">
                          Playlists
                        </button>
                        <button className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-2xl text-sm font-semibold transition-colors">
                          Artists
                        </button>
                        <button className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-2xl text-sm font-semibold transition-colors">
                          Albums
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockPlaylists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center gap-6 p-4 rounded-2xl hover:bg-[#2a2a2a]/50 cursor-pointer group transition-all duration-200"
                        >
                          <img
                            src={playlist.coverUrl || "/placeholder.svg"}
                            alt={playlist.name}
                            className="w-20 h-20 rounded-xl object-cover shadow-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg mb-1">{playlist.name}</h4>
                            <p className="text-[#8a8a8a]">Playlist • {playlist.songCount} songs</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                              <Play size={20} fill="white" className="ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        togglePlayPause={togglePlayPause}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
        toggleLike={toggleLike}
        setIsShuffled={setIsShuffled}
        setRepeatMode={setRepeatMode}
      />

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} />
    </div>
  )
}
