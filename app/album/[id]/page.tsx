'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Play, Heart, MoreHorizontal, Clock, ArrowLeft, User } from "lucide-react"
import { Sidebar } from "@/app/components/sidebar"
import { PlayerBar } from "@/app/components/player-bar"
import { ProfileModal } from "@/app/components/profile-modal"
import TopBar from '@/app/components/topBar'

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
  // Die Lit (Playboi Carti) - 19 tracks
  { id: "1", title: "Long Time", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/longtime.mp3", liked: false },
  { id: "2", title: "R.I.P.", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/rip.mp3", liked: true },
  { id: "3", title: "Lean 4 Real (feat. Skepta)", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/lean4real.mp3", liked: false },
  { id: "4", title: "Old Money", artist: "Playboi Carti", album: "Die Lit", duration: 170, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/oldmoney.mp3", liked: false },
  { id: "5", title: "Love Hurts (feat. Travis Scott)", artist: "Playboi Carti", album: "Die Lit", duration: 200, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/lovehurts.mp3", liked: false },
  { id: "6", title: "Shoota (feat. Lil Uzi Vert)", artist: "Playboi Carti", album: "Die Lit", duration: 210, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/shoota.mp3", liked: false },
  { id: "7", title: "Right Now (feat. Pi'erre Bourne)", artist: "Playboi Carti", album: "Die Lit", duration: 175, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/rightnow.mp3", liked: false },
  { id: "8", title: "Poke It Out (feat. Nicki Minaj)", artist: "Playboi Carti", album: "Die Lit", duration: 195, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/pokeitout.mp3", liked: false },
  { id: "9", title: "Home (KOD)", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/home.mp3", liked: false },
  { id: "10", title: "Fell In Luv (feat. Bryson Tiller)", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/fellinluv.mp3", liked: false },
  { id: "11", title: "Foreign", artist: "Playboi Carti", album: "Die Lit", duration: 170, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/foreign.mp3", liked: false },
  { id: "12", title: "Pull Up", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/pullup.mp3", liked: false },
  { id: "13", title: "Mileage (feat. Chief Keef)", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/mileage.mp3", liked: false },
  { id: "14", title: "FlatBed Freestyle", artist: "Playboi Carti", album: "Die Lit", duration: 170, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/flatbedfreestyle.mp3", liked: false },
  { id: "15", title: "No Time (feat. Gunna)", artist: "Playboi Carti", album: "Die Lit", duration: 180, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/notime.mp3", liked: false },
  { id: "16", title: "Middle of the Summer (feat. Red Coldhearted)", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/middleofthesummer.mp3", liked: false },
  { id: "17", title: "Choppa Won't Miss (feat. Young Thug)", artist: "Playboi Carti", album: "Die Lit", duration: 170, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/choppawontmiss.mp3", liked: false },
  { id: "18", title: "R.I.P. Fredo", artist: "Playboi Carti", album: "Die Lit", duration: 150, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/ripfredo.mp3", liked: false },
  { id: "19", title: "Top", artist: "Playboi Carti", album: "Die Lit", duration: 160, coverUrl: "/albums/dieLit.jpg", audioUrl: "/audio/dielit/top.mp3", liked: false },

  // Playboi Carti (Self-Titled) - 15 tracks
  { id: "20", title: "Location", artist: "Playboi Carti", album: "Playboi Carti", duration: 180, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/location.mp3", liked: true },
  { id: "21", title: "Magnolia", artist: "Playboi Carti", album: "Playboi Carti", duration: 210, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/magnolia.mp3", liked: false },
  { id: "22", title: "Lookin (feat. Lil Uzi Vert)", artist: "Playboi Carti", album: "Playboi Carti", duration: 170, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/lookin.mp3", liked: false },
  { id: "23", title: "wokeuplikethis* (feat. Lil Uzi Vert)", artist: "Playboi Carti", album: "Playboi Carti", duration: 190, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/wokeuplikethis.mp3", liked: false },
  { id: "24", title: "Let It Go", artist: "Playboi Carti", album: "Playboi Carti", duration: 160, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/letitgo.mp3", liked: false },
  { id: "25", title: "Half & Half", artist: "Playboi Carti", album: "Playboi Carti", duration: 175, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/halfandhalf.mp3", liked: false },
  { id: "26", title: "New Choppa (feat. A$AP Rocky)", artist: "Playboi Carti", album: "Playboi Carti", duration: 180, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/newchoppa.mp3", liked: false },
  { id: "27", title: "Other Shit", artist: "Playboi Carti", album: "Playboi Carti", duration: 160, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/othershit.mp3", liked: false },
  { id: "28", title: "No. 9", artist: "Playboi Carti", album: "Playboi Carti", duration: 170, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/no9.mp3", liked: false },
  { id: "29", title: "Dothatshit!", artist: "Playboi Carti", album: "Playboi Carti", duration: 160, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/dothatshit.mp3", liked: false },
  { id: "30", title: "Lame Niggaz", artist: "Playboi Carti", album: "Playboi Carti", duration: 150, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/lameniggaz.mp3", liked: false },
  { id: "31", title: "Yah Mean", artist: "Playboi Carti", album: "Playboi Carti", duration: 140, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/yahmean.mp3", liked: false },
  { id: "32", title: "Flex (feat. Leven Kali)", artist: "Playboi Carti", album: "Playboi Carti", duration: 180, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/flex.mp3", liked: false },
  { id: "33", title: "Kelly K", artist: "Playboi Carti", album: "Playboi Carti", duration: 170, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/kellyk.mp3", liked: false },
  { id: "34", title: "Had 2", artist: "Playboi Carti", album: "Playboi Carti", duration: 160, coverUrl: "/albums/selfTitled.jpg", audioUrl: "/audio/selftitled/had2.mp3", liked: false },

  // Whole Lotta Red (Playboi Carti) - 24 tracks
  { id: "35", title: "Rockstar Made", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/rockstarmade.mp3", liked: false },
  { id: "36", title: "Go2DaMoon (feat. Kanye West)", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 150, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/go2damoon.mp3", liked: true },
  { id: "37", title: "Stop Breathing", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/stopbreathing.mp3", liked: false },
  { id: "38", title: "Beno!", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/beno.mp3", liked: false },
  { id: "39", title: "JumpOutTheHouse", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 140, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/jumpoutthehouse.mp3", liked: false },
  { id: "40", title: "M3tamorphosis (feat. Kid Cudi)", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 210, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/m3tamorphosis.mp3", liked: false },
  { id: "41", title: "Slay3r", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/slay3r.mp3", liked: false },
  { id: "42", title: "No Sl33p", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/nosl33p.mp3", liked: false },
  { id: "43", title: "New Tank", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/newtank.mp3", liked: false },
  { id: "44", title: "Teen X (feat. Future)", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/teenx.mp3", liked: false },
  { id: "45", title: "Meh", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/meh.mp3", liked: false },
  { id: "46", title: "Vamp Anthem", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 150, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/vampanthem.mp3", liked: false },
  { id: "47", title: "New N3on", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/newn3on.mp3", liked: false },
  { id: "48", title: "Control", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/control.mp3", liked: false },
  { id: "49", title: "Punk Monk", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 200, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/punkmonk.mp3", liked: false },
  { id: "50", title: "On That Time", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/onthattime.mp3", liked: false },
  { id: "51", title: "King Vamp", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/kingvamp.mp3", liked: false },
  { id: "52", title: "Place", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/place.mp3", liked: false },
  { id: "53", title: "Sky", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 190, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/sky.mp3", liked: false },
  { id: "54", title: "Over", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/over.mp3", liked: false },
  { id: "55", title: "ILoveUIHateU", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 170, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/iloveuihateu.mp3", liked: false },
  { id: "56", title: "Die4Guy", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 180, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/die4guy.mp3", liked: false },
  { id: "57", title: "Not PLaying", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 160, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/notplaying.mp3", liked: false },
  { id: "58", title: "F33l Lik3 Dyin", artist: "Playboi Carti", album: "Whole Lotta Red", duration: 200, coverUrl: "/albums/WLR.jpg", audioUrl: "/audio/wlr/f33llik3dyin.mp3", liked: false },

  // My Beautiful Dark Twisted Fantasy (Kanye West) - 13 tracks
  { id: "59", title: "Dark Fantasy", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 255, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/darkfantasy.mp3", liked: false },
  { id: "60", title: "Gorgeous (feat. Kid Cudi & Raekwon)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 350, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/gorgeous.mp3", liked: false },
  { id: "61", title: "POWER", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 292, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/power.mp3", liked: true },
  { id: "62", title: "All of the Lights (Interlude)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 90, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/allofthelightsinterlude.mp3", liked: false },
  { id: "63", title: "All of the Lights", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 299, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/allofthelights.mp3", liked: false },
  { id: "64", title: "Monster (feat. Jay-Z, Rick Ross, Nicki Minaj & Bon Iver)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 370, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/monster.mp3", liked: false },
  { id: "65", title: "So Appalled (feat. Jay-Z, Pusha T, CyHi The Prynce, Swizz Beatz & RZA)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 360, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/soappalled.mp3", liked: false },
  { id: "66", title: "Devil In a New Dress (feat. Rick Ross)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 350, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/devilinadress.mp3", liked: false },
  { id: "67", title: "Runaway (feat. Pusha T)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 550, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/runaway.mp3", liked: false },
  { id: "68", title: "Hell Of A Life", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 340, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/hellofalife.mp3", liked: false },
  { id: "69", title: "Blame Game (feat. John Legend)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 480, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/blamegame.mp3", liked: false },
  { id: "70", title: "Lost In The World (feat. Bon Iver)", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 270, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/lostintheworld.mp3", liked: false },
  { id: "71", title: "Who Will Survive In America", artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", duration: 110, coverUrl: "/albums/MBDTF.jpg", audioUrl: "/audio/mbdtf/whowillsurvive.mp3", liked: false },

  // Father Stretch My Hands Pt.1 (Kanye West) - 2 tracks (Pt. 1 & Pt. 2)
  { id: "72", title: "Father Stretch My Hands Pt. 1", artist: "Kanye West", album: "Father Stretch My Hands Pt.1", duration: 140, coverUrl: "/albums/FSMH.jpg", audioUrl: "/audio/fsmh/pt1.mp3", liked: false },
  { id: "73", title: "Pt. 2", artist: "Kanye West", album: "Father Stretch My Hands Pt.1", duration: 160, coverUrl: "/albums/FSMH.jpg", audioUrl: "/audio/fsmh/pt2.mp3", liked: false },

  // Ocean Dreams (Aqua Sounds) - 5 tracks (example, since no real data)
  { id: "74", title: "Waves", artist: "Aqua Sounds", album: "Ocean Dreams", duration: 200, coverUrl: "/placeholder.svg?height=300&width=300", audioUrl: "/audio/oceandreams/waves.mp3", liked: false },
  { id: "75", title: "Deep Blue", artist: "Aqua Sounds", album: "Ocean Dreams", duration: 180, coverUrl: "/placeholder.svg?height=300&width=300", audioUrl: "/audio/oceandreams/deepblue.mp3", liked: false },
  { id: "76", title: "Coral Garden", artist: "Aqua Sounds", album: "Ocean Dreams", duration: 210, coverUrl: "/placeholder.svg?height=300&width=300", audioUrl: "/audio/oceandreams/coralgarden.mp3", liked: false },
  { id: "77", title: "Moonlit Tide", artist: "Aqua Sounds", album: "Ocean Dreams", duration: 190, coverUrl: "/placeholder.svg?height=300&width=300", audioUrl: "/audio/oceandreams/moonlittide.mp3", liked: false },
  { id: "78", title: "Drift", artist: "Aqua Sounds", album: "Ocean Dreams", duration: 220, coverUrl: "/placeholder.svg?height=300&width=300", audioUrl: "/audio/oceandreams/drift.mp3", liked: false },
]

const mockAlbums: Album[] = [
  {
    id: "1",
    title: "Die Lit",
    artist: "Playboi Carti",
    coverUrl: "/albums/dieLit.jpg",
    year: 2024,
    genre: "Electronic",
    songs: mockSongs.filter((song) => song.album === "Die Lit"),
  },
  {
    id: "2",
    title: "Playboi Carti",
    artist: "Playboi Carti",
    coverUrl: "/albums/selfTitled.jpg",
    year: 2023,
    genre: "Synthwave",
    songs: mockSongs.filter((song) => song.album === "Playboi Carti"),
  },
  {
    id: "3",
    title: "Whole Lotta Red",
    artist: "Playboi Carti",
    coverUrl: "/albums/WLR.jpg",
    year: 2024,
    genre: "Ambient",
    songs: mockSongs.filter((song) => song.album === "Whole Lotta Red"),
  },
  {
    id: "4",
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    coverUrl: "/albums/MBDTF.jpg",
    year: 2023,
    genre: "Hip-Hop",
    songs: mockSongs.filter((song) => song.album === "My Beautiful Dark Twisted Fantasy"),
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

function AlbumDetail({ album, onBack, onPlaySong, onToggleLike, formatTime }: {
  album: Album
  onBack: () => void
  onPlaySong: (song: Song, songList: Song[]) => void
  onToggleLike: (songId: string) => void
  formatTime: (seconds: number) => string
}) {
  const totalDuration = album.songs.reduce((total, song) => total + song.duration, 0)

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8a8a8a] hover:text-white transition-colors pt-6"
      >
        <ArrowLeft size={20} />
        <span className='font-semibold'>Back</span>
      </button>

      {/* Album Header */}
      <div className="flex items-end gap-8">
        <div className="relative">
          <img
            src={album.coverUrl || "/placeholder.svg"}
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
            <span className="text-sm font-semibold ">{formatTime(totalDuration)}</span>
          </div > 
          {album.genre && <p className="text-[#8a8a8a] text-sm font-semibold  mb-6">{album.genre}</p>}
          <div className="flex items-center gap-4">
            <button
              onClick={() => album.songs.length > 0 && onPlaySong(album.songs[0], album.songs)}
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
      ) : (
        <div className="text-center py-12">
          <p className="text-[#8a8a8a] text-lg">No songs available for this album</p>
        </div>
      )}

      {/* Album Info */}
      <div className="pt-8 border-t border-[#2a2a2a]">
        <p className="text-[#8a8a8a] text-sm leading-relaxed">
          Released {album.year} • {album.songs.length} tracks • {formatTime(album.songs.reduce((total, song) => total + song.duration, 0))} total duration
        </p>
      </div>
    </div>
  )
}

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  
  // Album page specific state
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Music player state
  const [currentSong, setCurrentSong] = useState<Song | null>(mockSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [activeView, setActiveView] = useState<"home" | "search" | "albums" | "library">("albums")
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [queue, setQueue] = useState<Song[]>(mockSongs)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const albumId = params?.id as string
    if (albumId) {
      const foundAlbum = mockAlbums.find(a => a.id === albumId)
      setAlbum(foundAlbum || null)
    }
    setLoading(false)
  }, [params?.id])

  // Utility functions
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

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

  const handlePlaySong = (song: Song, songList: Song[] = mockSongs) => {
    setCurrentSong(song)
    setQueue(songList)
    setCurrentIndex(songList.findIndex((s) => s.id === song.id))
    setIsPlaying(true)
  }

  const handleToggleLike = (songId: string) => {
    if (!album) return
    
    const updatedSongs = album.songs.map(song =>
      song.id === songId ? { ...song, liked: !song.liked } : song
    )
    
    setAlbum({ ...album, songs: updatedSongs })
    console.log("Toggle like for song:", songId)
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
        <Sidebar activeView="albums" setActiveView={setActiveView} playlists={mockPlaylists} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar setIsProfileModalOpen={setIsProfileModalOpen} />

          {/* Album Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <AlbumDetail
              album={album}
              onBack={handleBack}
              onPlaySong={handlePlaySong}
              onToggleLike={handleToggleLike}
              formatTime={formatTime}
            />
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
        toggleLike={handleToggleLike}
        setIsShuffled={setIsShuffled}
        setRepeatMode={setRepeatMode}
      />

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} />
    </div>
  )
}





