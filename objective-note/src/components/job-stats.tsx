"use client"

import { Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJobStorage } from "@/hooks/use-job-storage"

export function JobStats() {
  const { jobs, isLoading } = useJobStorage()

  const totalJobs = jobs.length
  const appliedJobs = jobs.filter(job => job.status === 'applied').length
  const interviewingJobs = jobs.filter(job => job.status === 'interviewing').length

  return (
    <div className="flex justify-center">
      <Card className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-border animate-in fade-in slide-in-from-bottom-4 w-full max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs Applied</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {isLoading ? (
              <div className="h-10 w-20 bg-muted animate-pulse rounded" />
            ) : (
              totalJobs
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : "Jobs in your list"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
