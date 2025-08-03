"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { AddJobDialog } from "@/components/add-job-dialog"
import { Job } from "@/types/job"

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev])
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <p className="text-sm text-muted-foreground">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} in your list
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="transition-all duration-200 hover:scale-105">
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
          <p className="text-muted-foreground">
            Start tracking your job applications by adding your first job.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <AddJobDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onAddJob={handleAddJob}
      />
    </div>
  )
} 