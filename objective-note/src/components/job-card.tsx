"use client"

import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Job, JobStatus } from "@/types/job"

interface JobCardProps {
  job: Job
  onDelete?: () => void
  onEdit?: () => void
  onClick?: () => void
}

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applying: { label: "Applying", variant: "outline" },
  applied: { label: "Applied", variant: "secondary" },
  interviewing: { label: "Interviewing", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  ghosted: { label: "Ghosted", variant: "destructive" },
}

export function JobCard({ job, onDelete, onEdit, onClick }: JobCardProps) {
  const status = statusConfig[job.status]
  const formattedDate = new Date(job.createdAt).toLocaleDateString()

  return (
    <Card 
      className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-border cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {job.title}
          </CardTitle>
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Badge variant={status.variant} className="transition-all duration-200 text-xs !text-xs px-2 py-0.5">
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {job.url && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => window.open(job.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Job Posting
              </Button>
            </div>
          )}
          
          {job.notes && (
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              <p className="font-medium text-foreground mb-1">Notes:</p>
              <p className="whitespace-pre-wrap line-clamp-3 text-xs">
                {job.notes}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Added {formattedDate}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 