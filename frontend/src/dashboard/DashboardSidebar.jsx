import { useNavigate } from "react-router-dom";
import { Send, Inbox, PlusCircle, Briefcase, Menu } from "lucide-react";

function DashboardSidebar({ activeView, onChange }) {
  const navigate = useNavigate();

  return (
    <aside className="dashboard-sidebar">
      {/* Visual handle with sideways hamburger */}
      <div className="sidebar-handle">
        <Menu size={20} />
      </div>

      <div className="sidebar-content">
        <button
          onClick={() => onChange("outgoing")}
          className={`sidebar-item ${activeView === "outgoing" ? "primary-item active" : "primary-item"}`}
        >
          <Send size={20} className="mr-3 flex-shrink-0" />
          <span className="sidebar-item-text">My Requests</span>
        </button>

        <button
          onClick={() => onChange("incoming")}
          className={`sidebar-item ${activeView === "incoming" ? "accent-item active" : "accent-item"}`}
        >
          <Inbox size={20} className="mr-3 flex-shrink-0" />
          <span className="sidebar-item-text">My Projects</span>
        </button>

        <div className="border-t my-3" style={{ borderColor: 'var(--border)' }} />

        <button
          onClick={() => navigate("/create-project?from=dashboard")}
          className="sidebar-item secondary-item"
        >
          <PlusCircle size={20} className="mr-3 flex-shrink-0" />
          <span className="sidebar-item-text">Create Project</span>
        </button>

        <button
          onClick={() => navigate("/create-internship?from=dashboard")}
          className="sidebar-item primary-item"
        >
          <Briefcase size={20} className="mr-3 flex-shrink-0" />
          <span className="sidebar-item-text">Create Internship</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;