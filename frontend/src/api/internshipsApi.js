export async function fetchInternships(token) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/internships`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch internships")
  }

  return data.internships || data
}
export async function createInternship(token, internshipData) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/internships`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(internshipData),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to create internship")
  }

  return data
}
