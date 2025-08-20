"use client"

import { useState } from "react"
import { FolderOpen, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useResumeStorage } from "@/hooks/use-resume-storage"

interface FolderManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFolder: string | null
  onFolderChanged?: () => void
}

export function FolderManagementDialog({ open, onOpenChange, selectedFolder, onFolderChanged }: FolderManagementDialogProps) {
  const { selectFolder, clearFolder } = useResumeStorage()
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeFolder = async () => {
    setIsLoading(true)
    try {
      const result = await selectFolder()
      if (result.success) {
        onOpenChange(false)
        // Trigger file review dialog in parent component
        if (onFolderChanged) {
          onFolderChanged()
        }
      }
    } catch (error) {
      console.error('Error changing folder:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFolder = async () => {
    setIsLoading(true)
    try {
      const result = await clearFolder()
      if (result.success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error clearing folder:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Resume Folder
          </DialogTitle>
          <DialogDescription>
            Choose what you'd like to do with your current resume folder. Note: This only affects the app's folder selection, not the actual files on your computer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {selectedFolder ? (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Current Folder:</p>
              <p className="text-sm text-muted-foreground break-all">{selectedFolder}</p>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">No folder currently selected.</p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={handleChangeFolder} 
              disabled={isLoading}
              className="w-full justify-start"
              variant="outline"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              {selectedFolder ? 'Change Folder' : 'Select Folder'}
            </Button>
            
            {selectedFolder && (
              <div className="space-y-2">
                <Button 
                  onClick={handleClearFolder} 
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Folder Path & Resume Entries
                </Button>
                <p className="text-xs text-muted-foreground">
                  This will remove the folder selection and all resume entries from the app, but won't delete any files from your computer.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
