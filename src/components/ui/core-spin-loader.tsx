'use client'

import { useEffect, useState } from 'react'

const loadingStates = ['Loading...', 'Fetching Data..', 'Syncing...', 'Processing..', 'Optimizing...']

export function CoreSpinLoader() {
  const [loadingText, setLoadingText] = useState('Initializing')

  useEffect(() => {
    let stateIndex = 0

    const interval = window.setInterval(() => {
      stateIndex = (stateIndex + 1) % loadingStates.length
      setLoadingText(loadingStates[stateIndex])
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/15" />

        <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-emerald-500/40" />

        <div className="absolute inset-1 animate-[spin_2s_linear_infinite] rounded-full border-2 border-transparent border-t-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />

        <div className="absolute inset-3 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-green-600 shadow-[0_0_6px_rgba(22,163,74,0.4)]" />

        <div className="absolute inset-5 animate-[spin_1s_ease-in-out_infinite] rounded-full border border-transparent border-l-green-700/60" />

        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-600 shadow-[0_0_4px_rgba(16,185,129,0.9)]" />
        </div>

        <div className="absolute h-2 w-2 animate-pulse rounded-full bg-emerald-700 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
      </div>

      <div className="flex h-8 flex-col items-center justify-center gap-1">
        <span
          key={loadingText}
          className="text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-700 animate-[pulse_0.6s_ease-out]"
        >
          {loadingText}
        </span>
      </div>
    </div>
  )
}
