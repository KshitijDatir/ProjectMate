import { useNavigate } from "react-router-dom";

function ProjectCard({ project, hasApplied = false }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="card-custom cursor-pointer"
    >
      {hasApplied && <span className="applied-badge">✓ Applied</span>}

      <h3 className="card-title pr-16">{project.title}</h3>

      <p className="card-desc mt-1">{project.owner?.name || "Unknown Owner"}</p>

      <p className="card-desc mt-3 line-clamp-3">{project.description}</p>

      {Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {project.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }}
            >
              {skill}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              +{project.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="card-footer">
        Team: {project.members?.length || 0}/{project.teamSize}
      </div>
    </div>
  );
}

export default ProjectCard;