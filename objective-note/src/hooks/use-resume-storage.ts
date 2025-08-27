import { useState, useEffect, useCallback } from 'react'
import { Resume, Tag, TAG_COLORS } from '@/types/resume'

// Type guard to check if we're in Electron environment
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI
}

// Fallback to localStorage for development/testing
const fallbackStorage = {
  getResumes: (): { resumes: Resume[]; tags: Tag[]; selectedFolder: string | null } => {
    try {
      const saved = localStorage.getItem('resumes')
      return saved ? JSON.parse(saved) : { resumes: [], tags: [], selectedFolder: null }
    } catch {
      return { resumes: [], tags: [], selectedFolder: null }
    }
  },
  saveResumes: (data: { resumes: Resume[]; tags: Tag[]; selectedFolder: string | null }): { success: boolean } => {
    try {
      localStorage.setItem('resumes', JSON.stringify(data))
      return { success: true }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return { success: false, error: error.message }
    }
  }
}

export function useResumeStorage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load resumes on mount
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        let data: { resumes: Resume[]; tags: Tag[]; selectedFolder: string | null }
        
        if (isElectron()) {
          // Use Electron IPC
          data = await window.electronAPI.getResumes()
        } else {
          // Fallback to localStorage
          data = fallbackStorage.getResumes()
        }
        
        setResumes(data.resumes)
        setTags(data.tags)
        setSelectedFolder(data.selectedFolder)
      } catch (err) {
        console.error('Error loading resumes:', err)
        setError('Failed to load resumes')
        setResumes([])
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }

    loadResumes()
  }, [])

  // Save resumes to storage
  const saveResumes = useCallback(async (resumesToSave: Resume[], tagsToSave: Tag[], folderPath: string | null = null) => {
    try {
      setError(null)
      
      // If folderPath is explicitly null, use null. Otherwise use the provided path or current selectedFolder
      const folderToSave = folderPath === null ? null : (folderPath || selectedFolder)
      
      let result: { success: boolean; error?: string }
      
      if (isElectron()) {
        // Use Electron IPC
        result = await window.electronAPI.saveResumes({ 
          resumes: resumesToSave, 
          tags: tagsToSave, 
          selectedFolder: folderToSave 
        })
      } else {
        // Fallback to localStorage
        result = fallbackStorage.saveResumes({ 
          resumes: resumesToSave, 
          tags: tagsToSave, 
          selectedFolder: folderToSave 
        })
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save resumes')
      }
      
      setResumes(resumesToSave)
      setTags(tagsToSave)
      // Always update selectedFolder when folderPath is provided (including null)
      if (folderPath !== undefined) {
        setSelectedFolder(folderPath)
      }
      return true
    } catch (err) {
      console.error('Error saving resumes:', err)
      setError('Failed to save resumes')
      return false
    }
  }, [selectedFolder])

  // Select resume folder
  const selectFolder = useCallback(async () => {
    try {
      setError(null)
      
      if (!isElectron()) {
        // Mock folder selection for development
        setSelectedFolder('/mock/resume/folder')
        return { success: true, folderPath: '/mock/resume/folder' }
      }
      
      const result = await window.electronAPI.selectResumeFolder()
      
      if (result.success && result.folderPath) {
        // Clear existing resumes when changing folder (keep tags)
        await saveResumes([], tags, result.folderPath)
        return result
      }
      
      return result
    } catch (err) {
      console.error('Error selecting folder:', err)
      setError('Failed to select folder')
      return { success: false, error: 'Failed to select folder' }
    }
  }, [tags, saveResumes])

  // Clear selected folder (removes folder path and resume entries, keeps tags)
  const clearFolder = useCallback(async () => {
    try {
      setError(null)
      // Clear resumes and selected folder path, keep tags
      // This does NOT delete files from the actual folder
      await saveResumes([], tags, null)
      return { success: true }
    } catch (err) {
      console.error('Error clearing folder:', err)
      setError('Failed to clear folder')
      return { success: false, error: 'Failed to clear folder' }
    }
  }, [tags, saveResumes])

  // Scan folder for resume files
  const scanFolder = useCallback(async (folderPath: string) => {
    try {
      setError(null)
      
      if (!isElectron()) {
        // Mock scanning for development
        return { 
          success: true, 
          files: [
            { fileName: 'resume.pdf', displayName: 'resume', filePath: '/mock/resume.pdf', fileType: 'pdf', size: 1024, modifiedDate: new Date().toISOString() }
          ] 
        }
      }
      
      return await window.electronAPI.scanFolderForResumes(folderPath)
    } catch (err) {
      console.error('Error scanning folder:', err)
      setError('Failed to scan folder')
      return { success: false, error: 'Failed to scan folder', files: [] }
    }
  }, [])

  // Validate folder access
  const validateFolder = useCallback(async (folderPath: string) => {
    try {
      if (!isElectron()) {
        return { success: true }
      }
      
      return await window.electronAPI.validateFolderAccess(folderPath)
    } catch (err) {
      console.error('Error validating folder:', err)
      return { success: false, error: 'Failed to validate folder' }
    }
  }, [])

  // Add a new resume
  const addResume = useCallback(async (resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResume: Resume = {
      ...resume,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Preserve the current selectedFolder when adding resumes
    const success = await saveResumes([newResume, ...resumes], tags, selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Add multiple resumes at once
  const addMultipleResumes = useCallback(async (resumeList: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newResumes: Resume[] = resumeList.map(resume => ({
      ...resume,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    
    // Preserve the current selectedFolder when adding resumes
    const success = await saveResumes([...newResumes, ...resumes], tags, selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Update an existing resume
  const updateResume = useCallback(async (resumeId: string, updates: Partial<Resume>) => {
    const updatedResumes = resumes.map(resume => 
      resume.id === resumeId 
        ? { ...resume, ...updates, updatedAt: new Date().toISOString() }
        : resume
    )
    
    const success = await saveResumes(updatedResumes, tags, selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Delete a resume
  const deleteResume = useCallback(async (resumeId: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== resumeId)
    const success = await saveResumes(updatedResumes, tags, selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Add a new tag
  const addTag = useCallback(async (name: string, color: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
    }
    
    const success = await saveResumes(resumes, [newTag, ...tags], selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Delete a tag
  const deleteTag = useCallback(async (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId)
    const updatedResumes = resumes.map(resume => 
      resume.tagId === tagId ? { ...resume, tagId: null } : resume
    )
    
    const success = await saveResumes(updatedResumes, updatedTags, selectedFolder)
    return success
  }, [resumes, tags, selectedFolder, saveResumes])

  // Get available colors
  const getAvailableColors = useCallback(() => {
    const usedColors = tags.map(tag => tag.color)
    return TAG_COLORS.filter(color => !usedColors.includes(color))
  }, [tags])

  // Refresh data from storage
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      let data: { resumes: Resume[]; tags: Tag[]; selectedFolder: string | null }
      
      if (isElectron()) {
        // Use Electron IPC
        data = await window.electronAPI.getResumes()
      } else {
        // Fallback to localStorage
        data = fallbackStorage.getResumes()
      }
      
      setResumes(data.resumes)
      setTags(data.tags)
      setSelectedFolder(data.selectedFolder)
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    resumes,
    tags,
    selectedFolder,
    isLoading,
    error,
    selectFolder,
    clearFolder,
    scanFolder,
    validateFolder,
    addResume,
    addMultipleResumes,
    updateResume,
    deleteResume,
    addTag,
    deleteTag,
    getAvailableColors,
    refresh
  }
}
