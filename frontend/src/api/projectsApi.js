const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function fetchProjects(token) {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch projects")
  }

  return res.json()
}
export async function createProject(token, projectData) {
  const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to create project")
  }

  return data
}

