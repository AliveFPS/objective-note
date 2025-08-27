import Layout from "@/components/layout"
import { ResumeList } from "@/components/resume-list"

export default function ResumesPage() {
  return (
    <Layout>
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Resumes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your resume files and organize them with tags
          </p>
        </div>
        <ResumeList />
      </div>
    </Layout>
  )
}
