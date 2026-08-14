export interface Empresa {
  id: string
  name: string
}

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  empresa: Empresa
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface FirstAdminPayload {
  name: string
  email: string
  password: string
  empresaName: string
}
