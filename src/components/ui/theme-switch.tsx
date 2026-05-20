'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

type ThemeSwitchProps = {
  className?: string
}

export function ThemeSwitch({ className = '' }: ThemeSwitchProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark')

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? 'dark'

    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

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
      aria-label={theme === 'light' ? 'Activer le theme sombre' : 'Activer le theme clair'}
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
