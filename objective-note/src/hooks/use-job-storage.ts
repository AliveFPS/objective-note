import { useState, useEffect, useCallback } from 'react'
import { Job } from '@/types/job'

// Type guard to check if we're in Electron environment
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI
}

// Fallback to localStorage for development/testing
const fallbackStorage = {
  getJobs: (): Job[] => {
    try {
      const saved = localStorage.getItem('jobs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  },
  saveJobs: (jobs: Job[]): { success: boolean } => {
    try {
      localStorage.setItem('jobs', JSON.stringify(jobs))
      return { success: true }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return { success: false, error: error.message }
    }
  }
}

export function useJobStorage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load jobs on mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        let loadedJobs: Job[]
        
        if (isElectron()) {
          // Use Electron IPC
          loadedJobs = await window.electronAPI.getJobs()
        } else {
          // Fallback to localStorage
          loadedJobs = fallbackStorage.getJobs()
        }
        
        setJobs(loadedJobs)
      } catch (err) {
        console.error('Error loading jobs:', err)
        setError('Failed to load jobs')
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [])

  // Save jobs to storage
  const saveJobs = useCallback(async (jobsToSave: Job[]) => {
    try {
      setError(null)
      
      let result: { success: boolean; error?: string }
      
      if (isElectron()) {
        // Use Electron IPC
        result = await window.electronAPI.saveJobs(jobsToSave)
      } else {
        // Fallback to localStorage
        result = fallbackStorage.saveJobs(jobsToSave)
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save jobs')
      }
      
      setJobs(jobsToSave)
      return true
    } catch (err) {
      console.error('Error saving jobs:', err)
      setError('Failed to save jobs')
      return false
    }
  }, [])

  // Add a new job
  const addJob = useCallback(async (newJob: Job) => {
    const updatedJobs = [newJob, ...jobs]
    const success = await saveJobs(updatedJobs)
    return success
  }, [jobs, saveJobs])

  // Update an existing job
  const updateJob = useCallback(async (jobId: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job
    )
    const success = await saveJobs(updatedJobs)
    return success
  }, [jobs, saveJobs])

  // Delete a job
  const deleteJob = useCallback(async (jobId: string) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId)
    const success = await saveJobs(updatedJobs)
    return success
  }, [jobs, saveJobs])

  return {
    jobs,
    isLoading,
    error,
    addJob,
    updateJob,
    deleteJob,
    refresh: () => window.location.reload() // Simple refresh for now
  }
} 