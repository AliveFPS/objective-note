import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Layout>
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Job Tracker</h2>
          <p className="text-slate-600 mb-4">
            Track your job applications, interviews, and progress all in one place.
          </p>
          <Button>Add Your First Job</Button>
        </div>
      </div>
    </Layout>
  )
}

export default App