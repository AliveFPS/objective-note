"use client"

import { useState, useEffect } from "react"
import { FileText, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useResumeStorage } from "@/hooks/use-resume-storage"

interface FileReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderPath: string
}

interface DetectedFile {
  fileName: string
  displayName: string
  filePath: string
  fileType: string
  size: number
  modifiedDate: string
}

export function FileReviewDialog({ open, onOpenChange, folderPath }: FileReviewDialogProps) {
  const { scanFolder, addResume } = useResumeStorage()
  const [detectedFiles, setDetectedFiles] = useState<DetectedFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [isScanning, setIsScanning] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Scan folder when dialog opens
  useEffect(() => {
    if (open && folderPath) {
      handleScanFolder()
    }
  }, [open, folderPath])

  const handleScanFolder = async () => {
    setIsScanning(true)
    try {
      const result = await scanFolder(folderPath)
      if (result.success) {
        setDetectedFiles(result.files)
        // Pre-select all files
        setSelectedFiles(new Set(result.files.map(f => f.filePath)))
      }
    } catch (error) {
      console.error('Error scanning folder:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileToggle = (filePath: string, checked: boolean) => {
    const newSelected = new Set(selectedFiles)
    if (checked) {
      newSelected.add(filePath)
    } else {
      newSelected.delete(filePath)
    }
    setSelectedFiles(newSelected)
  }

  const handleSelectAll = () => {
    setSelectedFiles(new Set(detectedFiles.map(f => f.filePath)))
  }

  const handleSelectNone = () => {
    setSelectedFiles(new Set())
  }

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const selectedFileList = detectedFiles.filter(f => selectedFiles.has(f.filePath))
      
      for (const file of selectedFileList) {
        const success = await addResume({
          title: file.displayName,
          fileName: file.fileName,
          filePath: file.filePath,
          fileType: file.fileType as any,
          tagId: null,
        })
        
        if (!success) {
          throw new Error(`Failed to import ${file.displayName}`)
        }
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error importing files:', error)
      // You could show a toast notification here
    } finally {
      setIsImporting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'txt':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Detected Files</DialogTitle>
          <DialogDescription>
            Select which files you'd like to add to your resume collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isScanning ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Scanning folder for resume files...</p>
            </div>
          ) : detectedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resume files found in the selected folder.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: PDF, DOCX, DOC, TXT
              </p>
            </div>
          ) : (
            <>
              {/* Selection Controls */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedFiles.size} of {detectedFiles.length} files selected
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSelectNone}>
                    Select None
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {detectedFiles.map((file) => (
                  <Card key={file.filePath} className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={file.filePath}
                        checked={selectedFiles.has(file.filePath)}
                        onCheckedChange={(checked) => 
                          handleFileToggle(file.filePath, checked as boolean)
                        }
                      />
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getFileIcon(file.fileType)}
                        <div className="flex-1 min-w-0">
                          <Label 
                            htmlFor={file.filePath}
                            className="text-sm font-medium cursor-pointer break-words leading-tight"
                          >
                            {file.displayName}
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {file.fileType.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={selectedFiles.size === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Import Selected ({selectedFiles.size})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
