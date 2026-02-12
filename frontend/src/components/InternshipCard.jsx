import { useNavigate } from "react-router-dom"

function InternshipCard({ internship }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/internships/${internship._id}`)}
      className="bg-white border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {internship.title}
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        {internship.companyName} • {internship.role}
      </p>

      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
        {internship.description}
      </p>

      <div className="mt-4">
        <span className="text-xs text-gray-500">
          Deadline: {new Date(internship.deadline).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

export default InternshipCard
