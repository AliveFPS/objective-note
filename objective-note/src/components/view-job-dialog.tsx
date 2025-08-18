"use client"

import { ExternalLink, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Job, JobStatus } from "@/types/job"

interface ViewJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job | null
  onEdit?: () => void
  onDelete?: () => void
}

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  applying: { label: "Applying", variant: "outline" },
  applied: { label: "Applied", variant: "secondary" },
  interviewing: { label: "Interviewing", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  ghosted: { label: "Ghosted", variant: "destructive" },
}

export function ViewJobDialog({ open, onOpenChange, job, onEdit, onDelete }: ViewJobDialogProps) {
  if (!job) return null

  const status = statusConfig[job.status]
  const formattedCreatedDate = new Date(job.createdAt).toLocaleDateString()
  const formattedUpdatedDate = new Date(job.updatedAt).toLocaleDateString()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-8 pt-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold mb-2 truncate">{job.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-4 text-sm">
                <span>Added {formattedCreatedDate}</span>
                {formattedCreatedDate !== formattedUpdatedDate && (
                  <span>Updated {formattedUpdatedDate}</span>
                )}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={status.variant} className="text-sm">
                {status.label}
              </Badge>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="px-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Dynamic layout based on available content */}
          {job.description && job.url && job.notes ? (
            // All three exist - use 2-column layout
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg break-words">
                    {job.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-sm">Job URL</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-blue-600 hover:text-blue-700 transition-colors break-all"
                    onClick={() => window.open(job.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">View Job Posting</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium mb-2 text-sm">Notes</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg min-h-[120px] break-words">
                  {job.notes}
                </div>
              </div>
            </div>
          ) : (
            // Single column layout for better space utilization
            <div className="space-y-4">
              {job.description && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg break-words">
                    {job.description}
                  </p>
                </div>
              )}
              
              {job.url && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Job URL</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-blue-600 hover:text-blue-700 transition-colors break-all"
                    onClick={() => window.open(job.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">View Job Posting</span>
                  </Button>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2 text-sm">Notes</h4>
                {job.notes ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg min-h-[120px] break-words">
                    {job.notes}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg min-h-[120px] flex items-center">
                    No notes added yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 