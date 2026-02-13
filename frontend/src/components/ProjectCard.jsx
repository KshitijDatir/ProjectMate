import { useNavigate } from "react-router-dom"

function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {project.title}
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        {project.owner?.name || "Unknown Owner"}
      </p>

      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
        {project.description}
      </p>

      {/* Skills */}
      {Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {project.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {skill}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-xs text-gray-500">
              +{project.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500">
        Team: {project.members?.length || 0}/{project.teamSize}
      </div>
    </div>
  )
}

export default ProjectCard
