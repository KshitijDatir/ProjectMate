import { useNavigate } from "react-router-dom";

function InternshipCard({ internship }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/internships/${internship._id}`)}
      className="card-custom cursor-pointer"
    >
      <h3 className="card-title">{internship.title}</h3>

      <p className="card-desc mt-1">
        {internship.companyName} • {internship.role}
      </p>

      <p className="card-desc mt-3 line-clamp-3">{internship.description}</p>

      <div className="card-footer">
        Deadline: {new Date(internship.deadline).toLocaleDateString()}
      </div>
    </div>
  );
}

export default InternshipCard;