"use client"

import { useState } from "react"
import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { AddJobDialog } from "@/components/add-job-dialog"
import { EditJobDialog } from "@/components/edit-job-dialog"
import { ViewJobDialog } from "@/components/view-job-dialog"
import { useJobStorage } from "@/hooks/use-job-storage"
import { Job } from "@/types/job"

export function JobList() {
  const { jobs, isLoading, error, addJob, updateJob, deleteJob, refresh } = useJobStorage()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [viewingJob, setViewingJob] = useState<Job | null>(null)

  const handleAddJob = async (newJob: Job) => {
    const success = await addJob(newJob)
    if (success) {
      setIsAddDialogOpen(false)
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsEditDialogOpen(true)
  }

  const handleViewJob = (job: Job) => {
    setViewingJob(job)
    setIsViewDialogOpen(true)
  }

  const handleUpdateJob = async (jobId: string, updates: Partial<Job>) => {
    const success = await updateJob(jobId, updates)
    if (success) {
      setIsEditDialogOpen(false)
      setEditingJob(null)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    const success = await deleteJob(jobId)
    if (success) {
      setIsViewDialogOpen(false)
      setViewingJob(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <p className="text-sm text-muted-foreground">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} in your list
          </p>
          {error && (
            <p className="text-sm text-destructive mt-1">
              Error: {error}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refresh}
            disabled={isLoading}
            className="transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="transition-all duration-200 hover:scale-105"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 animate-in fade-in duration-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
          <p className="text-muted-foreground">
            Start tracking your job applications by adding your first job.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job, index) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onDelete={() => deleteJob(job.id)}
              onEdit={() => handleEditJob(job)}
              onClick={() => handleViewJob(job)}
              animationDelay={index * 100}
            />
          ))}
        </div>
      )}

      <AddJobDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddJob={handleAddJob}
      />
      
      <EditJobDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateJob={handleUpdateJob}
        job={editingJob}
      />
      
      <ViewJobDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        job={viewingJob}
        onEdit={() => {
          setIsViewDialogOpen(false)
          if (viewingJob) {
            setEditingJob(viewingJob)
            setIsEditDialogOpen(true)
          }
        }}
        onDelete={() => {
          if (viewingJob) {
            handleDeleteJob(viewingJob.id)
          }
        }}
      />
    </div>
  )
} 