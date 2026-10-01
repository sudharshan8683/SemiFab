import { createBrowserRouter } from 'react-router-dom'
import { PageShell } from './components/layout/PageShell'
import { AuthGuard } from './components/layout/AuthGuard'
import { RootRedirect } from './components/layout/RootRedirect'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { FabFloor } from './pages/FabFloor'
import { Analytics } from './pages/Analytics'
import { Maintenance } from './pages/Maintenance'
import { CompletedTask } from './pages/CompletedTask'
import { CompletionHistory } from './pages/CompletionHistory'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <AuthGuard><PageShell /></AuthGuard>,
    children: [
      {
        path: '/',
        element: <RootRedirect />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/floor',
        element: <FabFloor />
      },
      {
        path: '/analytics',
        element: <Analytics />
      },
      {
        path: '/maintenance',
        element: <Maintenance />
      },
      {
        path: '/maintenance/completed',
        element: <CompletedTask />
      },
      {
        path: '/history',
        element: <CompletionHistory />
      }
    ]
  }
])
