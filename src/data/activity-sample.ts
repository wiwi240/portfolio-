import type { ContributionDay } from '@/components/ui/contribution-skyline'

/* Placeholder activity so the home page has something to show.
   TODO: replace `activitySample` with real data, an array of { date: 'YYYY-MM-DD', count } (e.g. GitHub contributions fetched by the backend).
   Keep any token on the server: the component itself never makes a network call. */
export const activitySample: ContributionDay[] | undefined = undefined

// Fixed seed and end date: the sample is the same on every visit instead of changing with today's date.
export const activitySampleSeed = 11
export const activitySampleEnd = '2026-11-08'
