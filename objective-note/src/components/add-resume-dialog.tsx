"use client"

import { useState, useRef } from "react"
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
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import { useResumeStorage } from "@/hooks/use-resume-storage"
import { ResumeFileType, RESUME_FILE_TYPES } from "@/types/resume"

interface AddResumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFolder: string | null
  onResumeAdded?: () => void
}

export function AddResumeDialog({ open, onOpenChange, selectedFolder, onResumeAdded }: AddResumeDialogProps) {
  const { addResume } = useResumeStorage()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async () => {
    try {
      setError(null)
      setSuccess(false)
      
      // Check if we're in Electron environment
      if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.selectFile) {
        // Use Electron's native file picker
        const result = await window.electronAPI.selectFile({
          title: 'Select Resume File',
          filters: [
            { name: 'Resume Files', extensions: RESUME_FILE_TYPES }
          ]
        })
        
        if (result.success && result.filePath) {
          // Create a mock File object for display purposes
          const fileName = result.filePath.split('/').pop() || result.filePath.split('\\').pop() || 'Unknown'
          const mockFile = {
            name: fileName,
            path: result.filePath,
            size: 0, // We don't have size info from the picker
          } as any
          
          setSelectedFile(mockFile)
        }
      } else {
        setError('File selection is only available in the desktop application')
      }
    } catch (error) {
      console.error('Error selecting file:', error)
      setError('Failed to select file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedFolder) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      // Check if we're in Electron environment and the API is available
      if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.copyFileToFolder) {
        // Get the file path - in Electron, we need to use a different approach
        let filePath: string
        
        // Try to get the file path from the File object
        if ('path' in selectedFile && selectedFile.path) {
          filePath = selectedFile.path
        } else {
          // Fallback: we need to use a file picker that gives us the full path
          setError('Please use the file picker to select your resume file')
          setIsUploading(false)
          return
        }
        
        // Check for duplicate filename before uploading
        const fileName = selectedFile.name
        const targetPath = `${selectedFolder}/${fileName}`
        
        // Check if file already exists in the target folder
        if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.checkFileExists) {
          const exists = await window.electronAPI.checkFileExists(targetPath)
          if (exists) {
            setError(`A file named '${fileName}' already exists in your resume folder. Please rename your file or choose a different one, then try uploading again.`)
            setIsUploading(false)
            return
          }
        }
        
        console.log('Attempting to copy file:', { filePath, targetFolder: selectedFolder })
        
        // Use Electron API to copy file
        const result = await window.electronAPI.copyFileToFolder(filePath, selectedFolder)
        
        if (result.success && result.targetPath && result.fileName) {
          // Add the resume to the list
          const success = await addResume({
            title: result.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '), // Remove file extension and replace underscores with spaces
            fileName: result.fileName,
            filePath: result.targetPath,
            fileType: result.fileName.split('.').pop()?.toLowerCase() as ResumeFileType,
            tagId: null,
          })
          
          if (success) {
            setSuccess(true)
            setTimeout(() => {
              onOpenChange(false)
              onResumeAdded?.()
            }, 1500)
          } else {
            setError('Failed to add resume to your collection')
          }
        } else {
          setError(result.error || 'Failed to copy file')
        }
      } else {
        // Fallback for web environment or when Electron API is not available
        setError('File upload is only available in the desktop application. Please use the Electron app to upload files.')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setError(null)
    setSuccess(false)
    onOpenChange(false)
  }

  const resetState = () => {
    setSelectedFile(null)
    setError(null)
    setSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenAutoFocus={resetState}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Resume</DialogTitle>
          <DialogDescription>
            Upload a resume file and add it to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to select a resume file from your computer
                </p>
                <Button
                  variant="outline"
                  onClick={handleFileSelect}
                >
                  Choose File
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Supported formats: {RESUME_FILE_TYPES.join(', ').toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFolder}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success!
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
