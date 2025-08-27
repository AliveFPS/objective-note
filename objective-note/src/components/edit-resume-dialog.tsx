"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Resume } from "@/types/resume"

interface EditResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateResume: (resumeId: string, updates: Partial<Resume>) => void
  resume: Resume | null
}

export function EditResumeDialog({ open, onOpenChange, onUpdateResume, resume }: EditResumeDialogProps) {
  const [title, setTitle] = useState('')

  // Update form data when resume changes
  useEffect(() => {
    if (resume) {
      setTitle(resume.title)
    }
  }, [resume])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resume) return
    
    const updates: Partial<Resume> = {
      title: title.trim(),
      updatedAt: new Date().toISOString(),
    }
    
    onUpdateResume(resume.id, updates)
    onOpenChange(false)
  }

  if (!resume) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
          <DialogDescription>
            Update the title for this resume.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Developer Resume"
              required
            />
            <p className="text-xs text-muted-foreground">
              Original filename: {resume.fileName}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Update Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
