/**
 * API client for communicating with the Green Resourcerers backend.
 * Change API_BASE to point to your deployed server in production.
 */

export const API_BASE = 'http://localhost:8000'

export type RequestStatus = 'pending' | 'approved' | 'assigned' | 'completed' | 'cancelled'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'on_hold'

export interface HomeownerRequest {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  dish_count: number
  dish_location: string | null
  notes: string | null
  status: RequestStatus
  created_at: string | null
}

export interface Job {
  id: number
  request_id: number
  technician_id: number | null
  status: JobStatus
  scheduled_date: string | null
  completed_at: string | null
  dishes_removed: number
  materials_weight_lbs: number
  technician_notes: string | null
  admin_notes: string | null
  created_at: string | null
}

export interface Technician {
  id: number
  name: string
  email: string
  phone: string | null
  certification_number: string | null
  is_active: number
}

// ── API helpers ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Requests
export const submitRequest = (data: Omit<HomeownerRequest, 'id' | 'status' | 'created_at'>) =>
  request<HomeownerRequest>('/requests/', { method: 'POST', body: JSON.stringify(data) })

// Jobs
export const getJobs = (technicianId?: number) => {
  const qs = technicianId ? `?technician_id=${technicianId}` : ''
  return request<Job[]>(`/jobs/${qs}`)
}

export const getTechnicianJobs = (technicianId: number, status?: JobStatus) => {
  const qs = status ? `?status=${status}` : ''
  return request<Job[]>(`/technicians/${technicianId}/jobs${qs}`)
}

export const updateJobAsTechnician = (
  technicianId: number,
  jobId: number,
  data: Partial<Pick<Job, 'status' | 'dishes_removed' | 'materials_weight_lbs' | 'technician_notes'>>,
) =>
  request<Job>(`/technicians/${technicianId}/jobs/${jobId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

// Technicians
export const getTechnicians = () => request<Technician[]>('/technicians/')
