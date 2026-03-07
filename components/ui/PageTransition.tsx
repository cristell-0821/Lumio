'use client'

import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export default function PageTransition({ children }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      {children}
    </div>
  )
}