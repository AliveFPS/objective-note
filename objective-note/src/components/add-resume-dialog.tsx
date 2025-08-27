"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddResumeDialog({ open, onOpenChange }: AddResumeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Resume</DialogTitle>
          <DialogDescription>
            Upload a resume file and add it to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-center text-muted-foreground">
            Resume upload functionality coming soon...
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
