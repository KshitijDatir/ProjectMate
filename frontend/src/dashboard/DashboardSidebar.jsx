import { useNavigate } from "react-router-dom"

function DashboardSidebar({ activeView, onChange }) {
  const navigate = useNavigate()

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)]">
      <div className="p-4 space-y-2">

        <button
          onClick={() => onChange("outgoing")}
          className={`w-full text-left px-4 py-2 rounded-md ${
            activeView === "outgoing"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          My Requests {/* Outgoing Requests */}
        </button>

        <button
          onClick={() => onChange("incoming")}
          className={`w-full text-left px-4 py-2 rounded-md ${
            activeView === "incoming"
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          My Projects {/* Incoming Requests */}
        </button>

        <div className="border-t my-3" />

        {/* Create Project */}
        <button
          onClick={() => navigate("/create-project?from=dashboard")}
          className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Create Project
        </button>

        {/* Create Internship */}
        <button
          onClick={() => navigate("/create-internship?from=dashboard")}
          className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Create Internship
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar
