'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from "@/app/components/sidebar"
import { PlayerBar } from "@/app/components/player-bar"
import { ProfileModal } from "@/app/components/profile-modal"
import TopBar from '@/app/components/topBar'
import { AlbumWithSongs, getAlbumWithSongs } from '@/services/songsServices'
import { Song } from "@/app/types/songsTypes"
import AlbumDetail from '@/app/components/albumDetails'
import Image from 'next/image'

interface Playlist {
  id: string
  name: string
  coverUrl: string
  songCount: number
  songs: Song[]
}

const mockPlaylists: Playlist[] = [
  {
    id: "2",
    name: "Chill Vibes",
    coverUrl: "/chill.png",
    songCount: 28,
    songs: []
  },
]

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<AlbumWithSongs | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Music player state
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [activeView, setActiveView] = useState<"home" | "search" | "albums" | "library">("albums")
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [queue, setQueue] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const fetchAlbum = async () => {
      const albumId = params?.id as string
      if (albumId) {
        try {
          const albumData = await getAlbumWithSongs(albumId)
          setAlbum(albumData || null)
          if (albumData?.songs) {
            // setQueue(albumData.songs)
            // if (albumData.songs.length > 0 && !currentSong) {
            //   setCurrentSong(albumData.songs[0])
            // }
          }
        } catch (error) {
          console.error('Error fetching album:', error)
          setAlbum(null)
        }
      }
      setLoading(false)
    }
    fetchAlbum()
  }, [params?.id, currentSong])

  // Utility functions
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // const togglePlayPause = () => {
  //   setIsPlaying(!isPlaying)
  // }

  // const skipToNext = () => {
  //   if (queue.length === 0) return
  //   const nextIndex = (currentIndex + 1) % queue.length
  //   setCurrentIndex(nextIndex)
  //   setCurrentSong(queue[nextIndex])
  // }

  // const skipToPrevious = () => {
  //   if (queue.length === 0) return
  //   const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
  //   setCurrentIndex(prevIndex)
  //   setCurrentSong(queue[prevIndex])
  // }

  // const handlePlaySong = (song: Song, songList?: Song[]) => {
  //   const songsToUse = songList || album?.songs || []
  //   setCurrentSong(song)
  //   setQueue(songsToUse)
  //   setCurrentIndex(songsToUse.findIndex((s) => s.id === song.id))
  //   setIsPlaying(true)
  // }

  const handleToggleLike = (songId: string) => {
    if (!album) return
    
    const updatedSongs = album.songs.map(song =>
      song.id === songId ? { ...song, liked: !song.liked } : song
    )
    
    setAlbum({ ...album, songs: updatedSongs })
    
    // Update current song if it's the one being liked
    if (currentSong?.id === songId) {
      setCurrentSong({ ...currentSong, liked: !currentSong.liked })
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <Image src="/sound.gif" alt="pause" width={60} height={60} /> 
      </div>
    )
  }

  if (!album) {
    return (
      <div className="h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Album not found</h1>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          playlists={mockPlaylists} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar setIsProfileModalOpen={setIsProfileModalOpen} />

          {/* Album Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <AlbumDetail
              album={album}
              // onBack={handleBack}
              // onPlaySong={handlePlaySong}
              // onToggleLike={handleToggleLike}
              formatTime={formatTime}
            />
          </div>
        </div>
      </div>

    



      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} />
    </div>
  )
}