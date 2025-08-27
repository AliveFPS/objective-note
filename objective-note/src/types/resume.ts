export interface Tag {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface Resume {
  id: string
  title: string
  fileName: string
  filePath: string
  fileType: 'pdf' | 'docx' | 'doc' | 'txt'
  tagId: string | null
  createdAt: string
  updatedAt: string
}

export type ResumeFileType = 'pdf' | 'docx' | 'doc' | 'txt'

export const RESUME_FILE_TYPES: ResumeFileType[] = ['pdf', 'docx', 'doc', 'txt']

export const TAG_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280', // gray
]
