import Layout from "@/components/layout"
import { JobStats } from "@/components/job-stats"

export default function Home() {
  return (
    <Layout>
      <div className="w-full p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Objective Note</h1>
          <p className="text-muted-foreground">
            Track your job applications and stay organized in your career journey.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Job Statistics</h2>
          <JobStats />
        </div>
      </div>
    </Layout>
  )
}
