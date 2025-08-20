import { Job } from './job'
import { Resume, Tag } from './resume'

export interface ElectronAPI {
  getJobs: () => Promise<Job[]>
  saveJobs: (jobs: Job[]) => Promise<{ success: boolean; error?: string }>
  selectResumeFolder: () => Promise<{ success: boolean; folderPath?: string; error?: string }>
  getResumes: () => Promise<{ resumes: Resume[]; tags: Tag[]; selectedFolder: string | null }>
  saveResumes: (data: { resumes: Resume[]; tags: Tag[]; selectedFolder: string | null }) => Promise<{ success: boolean; error?: string }>
  validateFolderAccess: (folderPath: string) => Promise<{ success: boolean; error?: string }>
  scanFolderForResumes: (folderPath: string) => Promise<{ 
    success: boolean; 
    files: Array<{
      fileName: string;
      displayName: string;
      filePath: string;
      fileType: string;
      size: number;
      modifiedDate: string;
    }>;
    error?: string;
  }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 