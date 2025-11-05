import { ApiResponse } from "../../shared/types"

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = { ...init?.headers }
  if (!(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(path, { ...init, headers })
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || 'Request failed')
  return json.data
}