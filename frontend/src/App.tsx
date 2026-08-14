import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { FirstAdminSetupPage } from '@/features/auth/pages/FirstAdminSetupPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ClientDetailPage } from '@/features/clients/pages/ClientDetailPage'
import { ClientFormPage } from '@/features/clients/pages/ClientFormPage'
import { ClientsListPage } from '@/features/clients/pages/ClientsListPage'
import { TemplateDetailPage } from '@/features/library/pages/TemplateDetailPage'
import { TemplateFormPage } from '@/features/library/pages/TemplateFormPage'
import { TemplatesListPage } from '@/features/library/pages/TemplatesListPage'
import { ProjectDetailPage } from '@/features/projects/pages/ProjectDetailPage'
import { ProjectFormPage } from '@/features/projects/pages/ProjectFormPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/first-admin" element={<FirstAdminSetupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <ClientsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/new"
            element={
              <ProtectedRoute>
                <ClientFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <ClientDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id/edit"
            element={
              <ProtectedRoute>
                <ClientFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:clientId/projects/new"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <ProjectFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <TemplatesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/new"
            element={
              <ProtectedRoute>
                <TemplateFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/:id"
            element={
              <ProtectedRoute>
                <TemplateDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/:id/edit"
            element={
              <ProtectedRoute>
                <TemplateFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
