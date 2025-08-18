"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    // Start with invisible state
    setIsVisible(false)
    
    // Update current path
    setCurrentPath(pathname)
    
    // Trigger fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      key={currentPath}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-6 scale-95"
      }`}
      style={{ 
        transformOrigin: 'top center',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
}
