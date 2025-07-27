'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, Heart, MoreHorizontal, Clock, ArrowLeft, User } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"
import { PlayerBar } from "@/app/components/player-bar"
import { ProfileModal } from "@/app/components/profile-modal"
import TopBar from '@/app/components/topBar'
import { AlbumWithSongs, getAlbumWithSongs } from '@/services/songsServices'
import { Album, Song } from "@/app/types/songsTypes"


interface Playlist {
  id: string
  name: string
  coverUrl: string
  songCount: number

}




const mockPlaylists: Playlist[] = [
 
  {
    id: "2",
    name: "Chill Vibes",
    coverUrl: "/chill.png",
    songCount: 28
   
  },
]
export default function AlbumDetail({ album,  formatTime}: {  //onBack, onPlaySong, onToggleLike, 
    album: Album
    // onBack: () => void
    // onPlaySong: (song: Song, songList: Song[]) => void
    // onToggleLike: (songId: string) => void
     formatTime: (seconds: number) => string
  }) {
    const totalDuration = album.songs.reduce((total: any, song: { duration: any }) => total + song.duration, 0)
  
    return (
      <div className="space-y-8">
        {/* Back Button */}
        <button
        //   onClick={onBack}
          className="flex items-center gap-2 text-[#8a8a8a] hover:text-white transition-colors pt-6"
        >
          <ArrowLeft size={20} />
          <span className='font-semibold'>Back</span>
        </button>
  
        {/* Album Header */}
        <div className="flex items-end gap-8">
          <div className="relative">
            <img
              src={album.cover_url || "/placeholder.svg"}
              alt={album.title}
              className="w-64 h-64 rounded-2xl object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm text-[#8a8a8a] font-semibold uppercase tracking-wider mb-2">Album</p>
            <h1 className="text-4xl font-bold mb-4 text-white">{album.title}</h1>
            <div className="flex items-center gap-2 text-[#8a8a8a] mb-4">
              <span className="text-gray-300 font-semibold">{album.artist}</span>
              <span>•</span>
              <span className="text-sm font-semibold ">{album.year}</span>
              <span>•</span>
              <span className="text-sm font-semibold ">{album.songs.length} songs</span>
              <span>•</span>
              <span className="text-sm font-semibold ">{totalDuration.toFixed(0)} min</span>
            </div > 
            {album.genre && <p className="text-[#8a8a8a] text-sm font-semibold  mb-6">{album.genre}</p>}
            <div className="flex items-center gap-4">
              <button
                // onClick={() => album.songs.length > 0 && onPlaySong(album.songs[0], album.songs)}
                className="w-14 h-14 bg-gradient-to-br from-gray-600 to-violet-400 rounded-full flex items-center justify-center  disabled:cursor-not-allowed cursor-pointer"
                disabled={album.songs.length === 0}
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
        {album.songs.length > 0 ? (
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
            {album.songs.map((song: Song, index: number) => (
              <div
                key={song.id}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 rounded-xl hover:bg-[#2a2a2a]/50 cursor-pointer group transition-all duration-200"
                // onClick={() => onPlaySong(song, album.songs)}
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
                    //   onToggleLike(song.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#3a3a3a]/50"
                  >
                    <Heart
                      size={16}
                      // className={song.liked ? "fill-purple-400 text-purple-400" : "text-[#8a8a8a] hover:text-white"}
                    />
                  </button>
                </div>
                <div className="w-16 text-center text-[#8a8a8a] text-sm font-mono">{song.duration}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#8a8a8a] text-lg">No songs available for this album</p>
          </div>
        )}
  
        {/* Album Info */}
        <div className="pt-8 border-t border-[#2a2a2a]">
          <p className="text-[#8a8a8a] text-sm leading-relaxed">
            Released {album.year} • {album.songs.length} tracks • {formatTime(album.songs.reduce((total: any, song: { duration: any }) => total + song.duration, 0))} total duration
          </p>
        </div>
      </div>
    )
  }