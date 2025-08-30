"use client"

import { useState, useEffect } from "react"
import { FolderOpen, Plus, RefreshCw, Settings, Trash2, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResumeStorage } from "@/hooks/use-resume-storage"
import { ResumeCard } from "@/components/resume-card"
import { AddResumeDialog } from "@/components/add-resume-dialog"
import { EditResumeDialog } from "@/components/edit-resume-dialog"
import { FileReviewDialog } from "@/components/file-review-dialog"
import { FolderManagementDialog } from "@/components/folder-management-dialog"
import { Resume } from "@/types/resume"

export function ResumeList() {
  const { 
    resumes, 
    selectedFolder, 
    isLoading, 
    error, 
    selectFolder, 
    clearFolder,
    validateFolder,
    updateResume,
    deleteResume,
    refresh 
  } = useResumeStorage()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResume, setEditingResume] = useState<Resume | null>(null)
  const [isFileReviewDialogOpen, setIsFileReviewDialogOpen] = useState(false)
  const [isFolderManagementDialogOpen, setIsFolderManagementDialogOpen] = useState(false)

  const handleSelectFolder = async () => {
    const result = await selectFolder()
    if (result.success) {
      // Folder selected successfully, now show file review dialog
      setIsFileReviewDialogOpen(true)
    }
  }

  const handleFolderManagement = () => {
    setIsFolderManagementDialogOpen(true)
  }

  const handleValidateFolder = async () => {
    if (selectedFolder) {
      const result = await validateFolder(selectedFolder)
      if (!result.success) {
        // Folder is no longer accessible, prompt user to reselect
        console.log('Folder validation failed:', result.error)
        // You could show a toast or modal here to prompt folder reselection
      }
    }
  }

  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume)
    setIsEditDialogOpen(true)
  }

  const handleDeleteResume = async (resume: Resume) => {
    if (confirm(`Are you sure you want to delete "${resume.title}"? This action cannot be undone.`)) {
      await deleteResume(resume.id)
    }
  }

  const handleUpdateResume = async (resumeId: string, updates: Partial<Resume>) => {
    await updateResume(resumeId, updates)
  }

  const handleManageFiles = () => {
    setIsFileReviewDialogOpen(true)
  }

  // Validate folder access on mount
  useEffect(() => {
    if (selectedFolder) {
      handleValidateFolder()
    }
  }, [selectedFolder])

  return (
    <div className="space-y-6">
      {/* Folder Selection */}
      {!selectedFolder ? (
        <div className="text-center py-16">
          <div className="mb-6">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select Resume Folder</h3>
            <p className="text-muted-foreground mb-6">
              Choose a folder on your device where your resume files are stored.
            </p>
            <Button onClick={handleSelectFolder} size="lg">
              <FolderOpen className="mr-2 h-4 w-4" />
              Select Folder
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Your Resumes</h2>
              <p className="text-sm text-muted-foreground">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} in your list
              </p>
              <p className="text-xs text-muted-foreground">
                Folder: {selectedFolder}
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
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleFolderManagement}
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
                title="Manage Folder"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={handleManageFiles}
                disabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Manage Files
              </Button>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Resume
              </Button>
            </div>
          </div>

          {/* Resume Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first resume to the selected folder.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Resume
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resumes.map((resume, index) => (
                <ResumeCard 
                  key={resume.id} 
                  resume={resume}
                  animationDelay={index * 100}
                  onEdit={() => handleEditResume(resume)}
                  onDelete={() => handleDeleteResume(resume)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Resume Dialog */}
      <AddResumeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      
      {/* Edit Resume Dialog */}
      <EditResumeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateResume={handleUpdateResume}
        resume={editingResume}
      />
      
      {/* File Review Dialog */}
      {selectedFolder && (
        <FileReviewDialog
          open={isFileReviewDialogOpen}
          onOpenChange={setIsFileReviewDialogOpen}
          folderPath={selectedFolder}
          onImportComplete={refresh}
          existingResumes={resumes.map(r => ({ filePath: r.filePath, id: r.id }))}
        />
      )}
      
      {/* Folder Management Dialog */}
      <FolderManagementDialog
        open={isFolderManagementDialogOpen}
        onOpenChange={setIsFolderManagementDialogOpen}
        selectedFolder={selectedFolder}
        onFolderChanged={() => setIsFileReviewDialogOpen(true)}
      />
    </div>
  )
}
