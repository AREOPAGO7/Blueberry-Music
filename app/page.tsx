'use client'

import { useState, useEffect } from 'react'
import { Play, Heart, Search, User } from "lucide-react"  
import { Sidebar } from "@/app/components/sidebar"

import { ProfileModal } from "@/app/components/profile-modal"
import { useRouter } from 'next/navigation';
import TopBar from '@/app/components/topBar';
import { useAuth } from '@/context/AuthContext';
import { getAllAlbumsWithSongs, Song, Album, AlbumWithSongs } from '@/services/songsServices'

interface Playlist {
  id: string
  name: string
  coverUrl: string
  songCount: number
  songs: Song[]
}

// Mock songs data for local testing


const mockPlaylists: Playlist[] = [
  {
    id: "2",
    name: "Chill Vibes",
    coverUrl: "/chill.png",
    songCount: 28,
    songs: [],
  },
]

export default function MusicPlayer() {
  // State management
  const [activeView, setActiveView] = useState<"home" | "search" | "albums" | "library">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [albums, setAlbums] = useState<AlbumWithSongs[]>([])
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(true)
  const { user } = useAuth();
  const router = useRouter();

  // Load albums from Supabase
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setIsLoadingAlbums(true);
        const albumsData = await getAllAlbumsWithSongs();
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error loading albums:', error);
        setAlbums([]);
      } finally {
        setIsLoadingAlbums(false);
      }
    };
    
    fetchAlbums();
  }, []);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Album functions
  const openAlbum = (album: Album) => {
    setSelectedAlbum(album)
  }

  const closeAlbum = () => {
    setSelectedAlbum(null)
  }

  // Search functionality
  const filteredSongs: Song[] = []

  // const filteredAlbums = mockAlbums.filter(
  //   (album) =>
  //     album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  // )
 

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
                        {isLoadingAlbums ? (
                          <div className="text-white">Loading albums...</div>
                        ) : albums.length > 0 ? (
                          albums.slice(0, 5).map((album) => (
                            <div key={album.id} className="group cursor-pointer" onClick={() => router.push(`/album/${album.id}`)}>
                              <div className="relative mb-4 w-50 h-50">
                                <img
                                  src={album.cover_url || "/placeholder.svg"}
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
                          ))
                        ) : (
                          <div className="text-white">No albums found</div>
                        )}
                      </div>
                    </div>
                  </div>
                
               
             
          </div>
        </div>
      </div>

     

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Hidden audio element for future implementation */}
     
    </div>
  )
}