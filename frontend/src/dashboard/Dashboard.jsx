import { useState } from "react"
import DashboardNavbar from "../components/DashboardNavbar"
import DashboardSidebar from "./DashboardSidebar"
import OutgoingRequests from "./OutgoingRequests"
import IncomingRequests from "./IncomingRequests"

function Dashboard() {
  // 🔹 controls which section is visible
  const [activeView, setActiveView] = useState("outgoing")

  return (
    <>
      <DashboardNavbar />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          activeView={activeView}
          onChange={setActiveView}
        />

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-8">
          {activeView === "outgoing" && <OutgoingRequests />}
          {activeView === "incoming" && <IncomingRequests />}
        </main>
      </div>
    </>
  )
}

export default Dashboard
