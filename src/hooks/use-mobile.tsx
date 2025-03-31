
import * as React from "react"

// Define breakpoints for different screen sizes
export const BREAKPOINTS = {
  MOBILE: 640,  // sm
  TABLET: 768,  // md
  DESKTOP: 1024 // lg
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Additional hook for more responsive design options
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  
  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.MOBILE) {
        setBreakpoint('mobile')
      } else if (width < BREAKPOINTS.TABLET) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    window.addEventListener('resize', updateBreakpoint)
    updateBreakpoint() // Initial check
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}
