import type { PathId } from './project-configurator'

// Optional looping clips for the home path cards. Drop files named after the path id into
// src/assets/path-videos/ (create, tool, improve, support; .mp4 and/or .webm). A path without a
// clip simply keeps its photo, so nothing breaks while clips are missing.
const files = import.meta.glob('../assets/path-videos/*.{mp4,webm}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

export type EntryVideoSource = { src: string; type: string }

export const entryVideos: Partial<Record<PathId, EntryVideoSource[]>> = {}
for (const [file, src] of Object.entries(files)) {
  const match = /([a-z]+)\.(mp4|webm)$/.exec(file)
  if (!match) continue
  const id = match[1] as PathId
  ;(entryVideos[id] ??= []).push({ src, type: `video/${match[2]}` })
}
