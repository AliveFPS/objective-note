import { Job } from './job'

export interface ElectronAPI {
  getJobs: () => Promise<Job[]>
  saveJobs: (jobs: Job[]) => Promise<{ success: boolean; error?: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 