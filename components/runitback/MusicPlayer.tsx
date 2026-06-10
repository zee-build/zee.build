'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'

// Add more MP3s to /public/runitback/audio and list them here.
const TRACKS = [
  { title: 'Love Me Again', artist: 'John Newman', src: '/runitback/audio/john-newman-love-me-again.mp3' },
  { title: 'Hit It', artist: 'American Authors', src: '/runitback/audio/American Authors - Hit It (Audio).mp3' },
  { title: 'Running', artist: 'David Dallas', src: '/runitback/audio/david-dallas-running.mp3' },
  { title: 'Alive', artist: 'Empire of the Sun', src: '/runitback/audio/empire-of-the-sun-alive.mp3' },
]

const STORAGE_KEY = 'runitback-music'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [collapsed, setCollapsed] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Always start collapsed — user can expand manually
  // (We still persist the track index preference but not the open/closed state)

  // Autoplay on load. Browsers block unmuted autoplay, so start muted and
  // unmute as soon as the visitor interacts with the page.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = true
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setHasError(true))

    const unmute = () => {
      if (audioRef.current) {
        audioRef.current.muted = false
        setMuted(false)
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
        }
      }
      window.removeEventListener('pointerdown', unmute)
      window.removeEventListener('keydown', unmute)
    }
    window.addEventListener('pointerdown', unmute)
    window.addEventListener('keydown', unmute)

    return () => {
      window.removeEventListener('pointerdown', unmute)
      window.removeEventListener('keydown', unmute)
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      window.localStorage.setItem(STORAGE_KEY, next ? 'closed' : 'open')
      return next
    })
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => setHasError(true))
      setPlaying(true)
    }
  }

  const changeTrack = (delta: number) => {
    setHasError(false)
    setTrackIndex((i) => (i + delta + TRACKS.length) % TRACKS.length)
    setPlaying(true)
    // Let the new src load before playing
    setTimeout(() => audioRef.current?.play().catch(() => setHasError(true)), 50)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  const track = TRACKS[trackIndex]

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        autoPlay
        onEnded={() => changeTrack(1)}
        onError={() => setHasError(true)}
      />

      {collapsed ? (
        <button
          onClick={toggleCollapsed}
          className="fixed bottom-4 right-4 z-50 flex items-center justify-center h-12 w-12 rounded-full bg-rib-acc text-rib-bg shadow-lg hover:scale-105 transition-transform"
          aria-label="Open music player"
        >
          <Music size={20} />
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 z-50 rib-tile rounded-xl p-3 w-64 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="rib-heading text-xs text-rib-acc" style={{ letterSpacing: '1.5px' }}>
              NOW PLAYING
            </span>
            <button onClick={toggleCollapsed} aria-label="Close music player" className="text-rib-muted hover:text-white">
              <X size={14} />
            </button>
          </div>

          <p className="rib-heading text-sm truncate">{track.title}</p>
          <p className="rib-body text-xs truncate mb-3">{track.artist}</p>

          {hasError && (
            <p className="rib-body text-[11px] text-red-400 mb-2">
              Couldn&apos;t load audio — check /public/runitback/audio
            </p>
          )}

          <div className="flex items-center justify-between">
            <button onClick={() => changeTrack(-1)} className="text-rib-muted hover:text-white" aria-label="Previous track">
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-rib-acc text-rib-bg"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={() => changeTrack(1)} className="text-rib-muted hover:text-white" aria-label="Next track">
              <SkipForward size={16} />
            </button>
            <button onClick={toggleMute} className="text-rib-muted hover:text-white" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
