import Layout from "@/components/layout"
import { JobList } from "@/components/job-list"

export default function JobListsPage() {
  return (
    <Layout>
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Job Lists</h1>
          <p className="text-muted-foreground mt-2">
            Track your job applications and interviews
          </p>
        </div>
        <JobList />
      </div>
    </Layout>
  )
} 