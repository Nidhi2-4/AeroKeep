const BASE_URL = 'http://localhost:8000/api'

const getToken = () => localStorage.getItem('aerokeep_token')

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` })
})

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('aerokeep_token')
    window.location.href = '/login'
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  get: (path) => fetch(`${BASE_URL}${path}`, { headers: headers() }).then(handleResponse),
  post: (path, body) => fetch(`${BASE_URL}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  put: (path, body) => fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (path) => fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: headers() }).then(handleResponse),
}