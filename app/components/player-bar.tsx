"use client"
import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreHorizontal, Shuffle, Repeat, Mic2 } from "lucide-react"
import { usePlayerStore } from "../store/usePlayerStore";

export function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  
  const {
    currentSong,
    isPlaying,
    volume,
    setSong,
    toggle,
    next,
    prev,
    setVolume,
    queue , hasUserInteracted, setHasUserInteracted
  } = usePlayerStore();

  // Handle user interaction for audio playback
  const handleUserInteraction = () => {
    setHasUserInteracted(true);
  };
  console.log(isPlaying)
console.log(currentSong)
console.log(volume)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasUserInteracted) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Playback error:", err);
          if (err.name === 'NotAllowedError') {
            console.log("Autoplay not allowed, user interaction required");
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, hasUserInteracted]);

 
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("currentSong", JSON.stringify(currentSong));
    }
  }, [currentSong]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVolume = localStorage.getItem("volume");
      if (storedVolume) {
        setVolume(Number(storedVolume));
      }
    }
  }, [setVolume]);

 

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);
  
  

  const handleEnded = () => {
    next();
  };

  useEffect(() => {
    const storedSong = localStorage.getItem("currentSong");
    if (storedSong) {
      const parsedSong = JSON.parse(storedSong);
      setSong(parsedSong);
    }
  }, []);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleUserInteraction();
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    handleUserInteraction();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    setVolume(percentage);
  };

  const handleToggle = () => {
    handleUserInteraction();
    toggle();
  };

  const handleNext = () => {
    handleUserInteraction();
    next();
  };

  const handlePrev = () => {
    handleUserInteraction();
    prev();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-24 bg-[#1e1e1e]/95 backdrop-blur-xl border-t border-[#2a2a2a] flex items-center px-6">
      {/* Current Song Info */}
      <audio
        ref={audioRef}
        src={currentSong?.audio_url}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        <div className="relative">
          <img
            src={currentSong?.cover_url || "/placeholder.svg"}
            alt={currentSong?.title || "Song"}
            className="w-16 h-16 rounded-lg object-cover shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate text-white">
            {currentSong?.title || "No song playing"}
          </p>
          <p className="text-sm text-[#8a8a8a] truncate">
            {currentSong?.artist || "Select a song to start"}
          </p>
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
          <button 
            onClick={handlePrev}
            className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]"
          >
            <SkipBack size={22} />
          </button>
          <button 
            onClick={handleToggle} 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black cursor-pointer shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-[#8a8a8a] hover:text-white transition-colors p-2 cursor-pointer rounded-lg hover:bg-[#2a2a2a]"
          >
            <SkipForward size={22} />
          </button>
          <button className="text-[#8a8a8a] hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-[#2a2a2a]">
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-[#8a8a8a] w-12 text-right font-mono">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-[#8a8a8a] w-12 font-mono">
            {formatTime(duration)}
          </span>
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
          <div 
            className="w-24 h-1.5 bg-[#3a3a3a] rounded-full overflow-hidden cursor-pointer"
            onClick={handleVolumeChange}
          >
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
