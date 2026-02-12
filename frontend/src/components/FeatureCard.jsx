function FeatureCard({ title, description, buttonText }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 text-gray-600">
        {description}
      </p>

      <button className="mt-6 text-blue-600 font-medium hover:underline">
        {buttonText} →
      </button>
    </div>
  )
}

export default FeatureCard
