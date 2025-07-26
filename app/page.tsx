'use client'

import { useState, useRef } from 'react'
import { Play, Heart, Search, User } from "lucide-react"  
import { Sidebar } from "@/app/components/sidebar"
import { PlayerBar } from "@/app/components/player-bar"
import { ProfileModal } from "@/app/components/profile-modal"
import { useRouter } from 'next/navigation';
import TopBar from '@/app/components/topBar';

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

// Mock songs data
const mockSongs: Song[] = [
  // Die Lit (Playboi Carti)
  { id: "1", title: "Long Time", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/longtime.mp3", liked: false },
  { id: "2", title: "R.I.P.", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/rip.mp3", liked: true },
  { id: "3", title: "Shoota (feat. Lil Uzi Vert)", artist: "Playboi Carti", album: "Die Lit", duration: 210, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/shoota.mp3", liked: false },
  { id: "4", title: "Poke It Out (feat. Nicki Minaj)", artist: "Playboi Carti", album: "Die Lit", duration: 195, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/pokeitout.mp3", liked: false },

  // Playboi Carti (Self-Titled)
  { id: "5", title: "Location", artist: "Playboi Carti", album: "Playboi Carti", duration: 180, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/location.mp3", liked: true },
  { id: "6", title: "Magnolia", artist: "Playboi Carti", album: "Playboi Carti", duration: 210, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/magnolia.mp3", liked: false },
  { id: "7", title: "wokeuplikethis* (feat. Lil Uzi Vert)", artist: "Playboi Carti", album: "Playboi Carti", duration: 190, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/wokeuplikethis.mp3", liked: false },

  // Whole Lotta Red
  { id: "8", title: "Rockstar Made", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/rockstarmade.mp3", liked: false },
  { id: "9", title: "Go2DaMoon (feat. Kanye West)", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 150, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/go2damoon.mp3", liked: true },
  { id: "10", title: "Stop Breathing", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/stopbreathing.mp3", liked: false },

  // My Beautiful Dark Twisted Fantasy (Kanye West)
  { id: "11", title: "Dark Fantasy", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 255, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/darkfantasy.mp3", liked: false },
  { id: "12", title: "POWER", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 292, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/power.mp3", liked: true },
  { id: "13", title: "All of the Lights", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 299, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/allofthelights.mp3", liked: false },

  // Father Stretch My Hands Pt.1 (Kanye West)
  { id: "14", title: "Father Stretch My Hands Pt. 1", artist: "Kanye West", album: "Father Stretch My Hands Pt.1", duration: 140, coverUrl: "/albums/FSMH.jpg", audioUrl: "/audio/fsmh/pt1.mp3", liked: false },
  { id: "15", title: "Pt. 2", artist: "Kanye West", album: "Father Stretch My Hands Pt.1", duration: 160, coverUrl: "/albums/FSMH.jpg", audioUrl: "/audio/fsmh/pt2.mp3", liked: false },
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
    id: "2",
    name: "Chill Vibes",
    coverUrl: "/chill.png",
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
  const router = useRouter();
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
        <Sidebar activeView="home" setActiveView={setActiveView} playlists={mockPlaylists} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar setIsProfileModalOpen={setIsProfileModalOpen} />

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            
          <div className="space-y-10">
                    {/* Greeting */}
                    <div className="pt-6">
                      <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-[#b0b0b0] bg-clip-text text-transparent">
                        Good evening
                      </h2>
                      <p className="text-[#8a8a8a] font-semibold text-sm">Ready to discover new music?</p>
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-4 text-white">Albums</h3>
                      <div className="flex flex-wrap gap-6 ">
                        {mockAlbums.slice(0, 5).map((album) => (
                          <div key={album.id} className="group cursor-pointer" onClick={() => router.push(`/album/${album.id}`)}>
                            <div className="relative mb-4 w-50 h-50">
                              <img
                                src={album.coverUrl || "/placeholder.svg"}
                                alt={album.title}
                                className=" w-full aspect-square object-cover rounded-xl shadow-xl "
                              />
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                  <Play size={30} fill="#9F26D8" className="ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h4 className="font-bold text-lg  truncate w-40">{album.title}</h4>
                            <p className="text-[#8a8a8a] text-[12px] font-semibold truncate w-40">{album.artist}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                
               
             
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