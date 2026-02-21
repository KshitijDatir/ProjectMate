import { Filter } from "lucide-react";
import CustomSelect from "./CustomSelect";

function ProjectFilters({
  scope,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  matchMySkills,
  onToggleMatchMySkills,
}) {
  const placeholder = scope === "internships" ? "Search internships..." : "Search projects...";

  // Define sort options based on scope
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  if (scope === "internships") {
    sortOptions.push({ value: "deadline", label: "Application Deadline" });
  }

  return (
    <div
      className="border rounded-xl p-4 mb-6"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Left controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Match My Skills (PROJECTS ONLY) */}
          {scope === "projects" && (
            <button
              onClick={onToggleMatchMySkills}
              className={`flex items-center px-4 py-2 rounded-lg text-sm border transition-all duration-200 hologram-btn ${
                matchMySkills ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: matchMySkills ? 'var(--primary)' : 'var(--surface)',
                borderColor: matchMySkills ? 'transparent' : 'var(--border)',
                color: matchMySkills ? 'white' : 'var(--text)',
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Match My Skills
            </button>
          )}

          {/* Custom Sort Dropdown */}
          <CustomSelect
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>

        {/* Search input */}
        <div className="flex-1 md:max-w-md">
          <input
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 transition-all duration-200"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              '--tw-ring-color': 'var(--primary)',
            }}
          />
        </div>
      </div>

      {searchQuery && (
        <div className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Search results for: <span className="font-medium">{searchQuery}</span>
          <button
            onClick={() => onSearchChange("")}
            className="ml-2 hover:underline transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectFilters;