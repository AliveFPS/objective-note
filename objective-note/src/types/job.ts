export type JobStatus = 'applying' | 'applied' | 'interviewing' | 'rejected' | 'ghosted'

export interface Job {
  id: string
  title: string
  description: string
  url: string
  status: JobStatus
  notes: string
  createdAt: string
  updatedAt: string
} 