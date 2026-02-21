import { useState } from "react"
import DashboardNavbar from "../components/DashboardNavbar"
import DashboardSidebar from "./DashboardSidebar"
import OutgoingRequests from "./OutgoingRequests"
import IncomingRequests from "./IncomingRequests"

function Dashboard() {
  const [activeView, setActiveView] = useState("outgoing")

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-container">
        <DashboardSidebar activeView={activeView} onChange={setActiveView} />
        <main className="dashboard-main">
          {activeView === "outgoing" && <OutgoingRequests />}
          {activeView === "incoming" && <IncomingRequests />}
        </main>
      </div>
    </>
  )
}

export default Dashboard