import { Filter } from "lucide-react"

function ProjectFilters({
  scope,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  matchMySkills,
  onToggleMatchMySkills,
}) {
  const placeholder =
    scope === "internships"
      ? "Search internships..."
      : "Search projects..."

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        {/* Left controls */}
        <div className="flex gap-3">

          {/* Match My Skills (PROJECTS ONLY) */}
          {scope === "projects" && (
            <button
              onClick={onToggleMatchMySkills}
              className={`flex items-center px-4 py-2 rounded-lg text-sm border transition ${
                matchMySkills
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Match My Skills
            </button>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            {scope === "internships" && (
              <option value="deadline">Application Deadline</option>
            )}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 md:max-w-md">
          <input
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {searchQuery && (
        <div className="mt-3 text-sm text-gray-600">
          Search results for: <span className="font-medium">{searchQuery}</span>
          <button
            onClick={() => onSearchChange("")}
            className="ml-2 text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectFilters
