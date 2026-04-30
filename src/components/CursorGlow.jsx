'use client'
import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const el = glowRef.current
    let animId

    const onMove = (e) => {
      cancelAnimationFrame(animId)
      animId = requestAnimationFrame(() => {
        el.style.left = e.clientX - 192 + 'px'
        el.style.top  = e.clientY - 192 + 'px'
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed w-96 h-96 rounded-full
        bg-blue-400 opacity-[0.06] blur-3xl transition-all
        duration-200 ease-out"
      style={{ zIndex: 0 }}
    />
  )
}