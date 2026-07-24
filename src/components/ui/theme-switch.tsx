'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

type ThemeSwitchProps = {
  className?: string
  lightThemeLabel?: string
  darkThemeLabel?: string
}

export function ThemeSwitch({
  className = '',
  lightThemeLabel = 'Activer le thème clair',
  darkThemeLabel = 'Activer le thème sombre',
}: ThemeSwitchProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    return (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? 'dark'
  })

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, [theme])

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? darkThemeLabel : lightThemeLabel}
      className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-[var(--text-color-primary)] transition-opacity hover:opacity-80 ${className}`}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'light'
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-50 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'dark'
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-50 opacity-0'
        }`}
      />
    </button>
  )
}
