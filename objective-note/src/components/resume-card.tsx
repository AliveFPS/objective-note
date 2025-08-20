"use client"

import { FileText, Edit, Trash2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Resume, Tag } from "@/types/resume"

interface ResumeCardProps {
  resume: Resume
  tag?: Tag | null
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  animationDelay?: number
}

export function ResumeCard({ 
  resume, 
  tag, 
  onEdit, 
  onDelete, 
  onView,
  animationDelay = 0 
}: ResumeCardProps) {
  const formattedDate = new Date(resume.createdAt).toLocaleDateString()

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-600" />
      case 'txt':
        return <FileText className="h-8 w-8 text-gray-500" />
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />
    }
  }

  const handleCardClick = () => {
    onView?.()
  }

  return (
    <Card 
      className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-border cursor-pointer animate-in fade-in slide-in-from-bottom-4"
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationDuration: '600ms',
        animationFillMode: 'both'
      }}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {resume.title}
          </CardTitle>
          {tag && (
            <div className="flex items-center gap-2">
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: tag.color,
                  color: 'white'
                }}
              >
                {tag.name}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* File Preview */}
          <div className="flex justify-center py-6 bg-muted/30 rounded-lg border border-border/50">
            {getFileIcon(resume.fileType)}
          </div>
          
          {/* File Info */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <p className="truncate">{resume.fileName}</p>
              <p className="text-xs uppercase">{resume.fileType}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Added {formattedDate}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  // Open file in default application
                  if (typeof window !== 'undefined' && window.electronAPI) {
                    // In Electron, we could open the file
                    console.log('Opening file:', resume.filePath)
                  }
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
